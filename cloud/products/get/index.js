const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require('../../utils/validate');
const shopifyInstance = require('../../utils/shopify-instance')
module.exports = {
	get_products: async ({ params, user }) => {
		const {
			ids = [], shop
		} = params;
		if (exists(ids, shop)) {
			try {
				if (!ids.length) {
					return []
				}
				const shopQuery = parseUtils.query('Shop');
				shopQuery.equalTo('shop', shop);
				let shopInstance = await shopQuery.first({ useMasterKey: true });
				if (shopInstance) {
					const shopifyNodeInstance = shopifyInstance({
						shopName: shop,
						accessToken: shopInstance.get('accessToken'),
					});
					const products = await shopifyNodeInstance.product.list({ ids: ids.join(',') });
					return products
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
		Parse.Cloud.define("get_products", async (req) => {
			try {
				const data = await this.get_products(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
