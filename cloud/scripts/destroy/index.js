const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require('../../utils/validate');
const shopifyInstance = require('../../utils/shopify-instance')

module.exports = {
	destroy_scripts: async ({ params, user }) => {
		const {
			shop
		} = params;
		if (exists(shop)) {
			try {
				const shopQuery = parseUtils.query('Shop');
				shopQuery.equalTo('shop', shop);
				let shopInstance = await shopQuery.first({ useMasterKey: true });
				if (shopInstance) {
					const shopifyNodeInstance = shopifyInstance({
						shopName: shop,
						accessToken: shopInstance.get('accessToken'),
					});
					const existingShopifyScriptTags = await shopifyNodeInstance.scriptTag.list();
					await Promise.all(existingShopifyScriptTags.map(async tag => await shopifyNodeInstance.scriptTag.delete(tag.id)))
				} else {
					const { code, message } = errors.constructErrorObject(400);
					throw new Parse.Error(code, message);
				}				
			} catch (e) {
				throw e;
			}
		} else {
			const { code, message } = errors.constructErrorObject(400);
			throw new Parse.Error(code, message);
		}
	},
	initRoutes(req, res) {
		Parse.Cloud.define("destroy_scripts", async (req) => {
			try {
				const data = await this.destroy_scripts(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
