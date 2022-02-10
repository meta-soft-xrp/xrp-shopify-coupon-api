const shopifyAuthNode = require('shopify-auth-node');
const shopifyInstance = require('../../utils/shopify-instance');
const user = require('../../user/post');
const parseUtils = require('../../utils/parse-utils');

module.exports = {
	bootstrap(app) {
		const redirectToApp = async ({ accessToken, res, shop, hmac, code, state, host  }) => {
			try {
				console.log(accessToken, shop)
				const shopifyNodeInstance = shopifyInstance({
					shopName: shop,
					accessToken: accessToken,
				});
				const shopifyShopData = await shopifyNodeInstance.shop.get();
				const userQuery = parseUtils.query('User');
				userQuery.equalTo('username', shopifyShopData.email);
				const userInstance = await userQuery.first();
				if (!userInstance) {
					await user.post_user({
						params: {
							username: shopifyShopData.email
						}
					});
				}
				const shopQuery = parseUtils.query('Shop');
				shopQuery.equalTo('shop', shop);
				let shopInstance = await shopQuery.first({ useMasterKey: true });
				if (shopInstance) {
					shopInstance.set('accessToken', accessToken);
					await shopInstance.save({ useMasterKey: true });
				} else {
					shopInstance = parseUtils.instance('Shop');
					shopInstance.set('shop', shop);
					shopInstance.set('accessToken', accessToken);
					const acl = new Parse.ACL();
					acl.setPublicWriteAccess(false);
					acl.setPublicReadAccess(false);
					shopInstance.setACL(acl)
					await shopInstance.save({ useMasterKey: true });
				}
				// const thirtyDays =  30 * 24 * 60 * 60 * 1000;
				// res.cookie('shoplooksaccesstoken', accessToken, { maxAge: thirtyDays, path: '/', domain: '.frangout.com', httpOnly: false, secure: false, });
				// res.cookie('shoplooksname', shop, { maxAge: thirtyDays, path: '/', domain: '.frangout.com', httpOnly: false, secure: false, });
				// res.cookie('shoplooksplatform', 'shopify', { maxAge: thirtyDays, path: '/', domain: '.frangout.com', httpOnly: false, secure: false, });
				res.redirect(302, `${process.env.SHOPIFY_DASHBOARD_SERVER_FORWARDING_ADDRESS}?host=${host}`);
			} catch (e) {
				console.error(e)
				res.send(`
					<form action="/retry" method="POST">
						<h3 style="color:red">Something went wrong.</h3>
						<h3>Please try again or contact support at <a href="mailto:sid@frangout.com">help@berrysupport.com</a></h3>
						<input hidden type="text" name="accessToken" value="${accessToken}" />
						<input hidden type="text" name="shop" value="${shop}" />
						<button style="font-size:2em" type="submit">RETRY</button>
					</form>
				`)
			}
		}
		
		shopifyAuthNode.bootstrap({
			app,
			shopifyAppScopes: 'read_script_tags,write_script_tags,read_products,write_products',
			shopifyApiKey: process.env.SHOPIFY_API_KEY,
			shopifyApiSecret: process.env.SHOPIFY_API_SECRET,
			shopifyAppUri: process.env.SHOPIFY_DASHBOARD_SERVER_FORWARDING_ADDRESS,
			successCallBack:  (params) => redirectToApp(params)
		});

		app.post('/retry', (req, res) => {
			const { accessToken, shop } = req.body;
			redirectToApp({ accessToken, shop, res });
		});
	}
}