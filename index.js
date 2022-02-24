if (process.env.NODE_ENV === 'DEV') {
	require("dotenv").config('./env');
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const path = require('path');
const routeCache = require('route-cache');
const parseServer = require('./cloud/bootstrap/parse-server');
const shopify = require('./cloud/bootstrap/shopify');
const fs = require('fs');
const app = express();
app.use(cookieParser());
app.options('*', cors({
	origin: '*',
	credentials: true,
}));
app.use(bodyParser.json({ }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ limit: '100mb' }))
app.use(express.static(path.join(__dirname, 'public')))

shopify.bootstrap(app);
const PARSE_SERVER_API = parseServer.bootstrap();
app.use('/parse', PARSE_SERVER_API);
app.get('/embed', (req, res) => {
	const { shop } = req.query;
	
	res.set('Content-Type', 'text/javascript');
	res.send(`
			const iframe = document.createElement('iframe');
			iframe.src = "${process.env.EMBED_SCRIPT_TAG_URL}?shop=${shop}";
			iframe.style.border = "none";
			iframe.width = "100%";
			iframe.height = "600px"
			const shopLookAppEle = document.querySelector('#frangout-shop-look-app');
			if (shopLookAppEle) {
				shopLookAppEle.style.width = "100%";
				shopLookAppEle.style.height = "600px";
				shopLookAppEle.appendChild(iframe);
			} else if (document.location.pathname === "/") {
				const footerDiv = document.querySelector('#shopify-section-footer');
				const footerElement = document.querySelector('footer');
				const footerToPrepend = footerDiv || footerElement;
				if (footerToPrepend) {
					footerToPrepend.prepend(iframe)
				}
			}
	`)
});
https://shopify-dev.myshopify.com https://admin.shopify.com

app.get('*', (req, res) => {
	console.log(req)
	const indexFilePath = path.join(__dirname, '.', 'index.html');
	res.set("Content-Security-Policy", `frame-ancestors https://dev-lookbook-frangout.myshopify.com https://admin.shopify.com`);
	fs.readFile(indexFilePath, 'utf8', function (err, data) {
		res.send(data)
	});
});

app.listen(process.env.API_APP_PORT, function () {
	console.log('READY');
});
// ParseServer.createLiveQueryServer(httpServer);
process.on('SIGINT', function () {
	console.log('SIGINT');
	process.exit();
});