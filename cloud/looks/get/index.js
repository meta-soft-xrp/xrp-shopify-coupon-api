const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require('../../utils/validate');

module.exports = {
	get_looks: async ({ params, user }) => {
		const {
			shop, id = ''
		} = params;
		if (exists(shop)) {
			try {
				const looksQuery = parseUtils.query('Looks');
				looksQuery.equalTo('shop', shop);
				looksQuery.descending('createdAt');
				const fud = id ? looksQuery.equalTo('objectId', id) : null;
				// const data = id ? await looksQuery.first(Parse.User.current()) :  await looksQuery.find(Parse.User.current());
				const data = id ? await looksQuery.first() :  await looksQuery.find();
				if (id && data.get('products').length) {
					const { data: products } = await Parse.Cloud.run('get_products', {
						shop: shop,
						ids: data.get('products').map(p => {
							if (typeof p === "string") {
								return p.split('/')?.pop()
							}
							return undefined
						}).filter(Boolean)
					});
					data.set('products', products);
				}
				return data;
			} catch (e) {
				throw e;
			}
		} else {
			const { code, message } = errors.constructErrorObject(400);
			throw new Parse.Error(code, message);
		}
	},
	initRoutes(req, res) {
		Parse.Cloud.define("get_looks", async (req) => {
			try {
				const data = await this.get_looks(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
