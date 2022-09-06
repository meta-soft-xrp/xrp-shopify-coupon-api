const ParseServer = require('parse-server').ParseServer;
const S3Adapter = require("@parse/s3-files-adapter");
const AWS = require("aws-sdk");

module.exports = {
	bootstrap() { 
		const s3Options = {
			bucket: process.env.S3_BUCKET_NAME,
			baseUrl: null,
			region: process.env.S3_REGION, 
			directAccess: true,
			bucketPrefix: process.env.S3_BUCKET_PREFIX,
			globalCacheControl: 'public, max-age=31536000'
		};
		const s3Adapter = new S3Adapter(s3Options);
		const api = new ParseServer({ 
			databaseURI: process.env.API_SHOPLOOKS_DATABASE_URI,
			cloud: __dirname + '/main.js',
			appId: process.env.API_SHOPLOOKS_PARSE_APP_ID,
			masterKey: process.env.API_SHOPLOOKS_SERVER_MASTER_KEY, //Add your master key here. Keep it secret!,
			serverURL: process.env.API_SHOPLOOKS_SERVER_URL + '/parse',
			fileKey: 'shoplooks',
			allowClientClassCreation: process.env.API_SHOPLOOKS_ALLOW_CLIENT_CLASS_CREATION,
			masterKeyIps: [],
			verbose: false,
			filesAdapter: s3Adapter,
			restApiKey: process.env.API_SHOPLOOKS_PARSE_REST_API_KEY,
			publicServerURL: process.env.API_SHOPLOOKS_PUBLIC_SERVER_URL + '/parse',//'http://4feea51e.ngrok.io/parse',
			readOnlyMasterKey: process.env.API_SHOPLOOKS_READ_ONLY_MASTER_KEY,
			maxUploadSize: "100mb",
		});
		return api;
	}
}
