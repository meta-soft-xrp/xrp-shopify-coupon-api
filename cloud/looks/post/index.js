const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require('../../utils/validate');

module.exports = {
	post_looks: async ({ params, user }) => {
		const {
			shop,
			name,
			price,
			xrpPrice,
			medias,
			products,
			id = '',
		} = params;
		console.log('XRP', xrpPrice);
		if (exists(shop)) { 
			try {
				const looksInstance = parseUtils.instance('Looks')
				if (id) {
					looksInstance.id = id;
				}
				looksInstance.set('name', name);
				looksInstance.set('price', price);
				looksInstance.set('xrpPrice', parseFloat(xrpPrice));
				looksInstance.set('medias', medias);
				looksInstance.set('products', products);
				looksInstance.set('shop', shop);
				// if (Parse.User.current() && Parse.User.current().id) {
				// 	looks.set('createdBy', Parse.User.current());
				// 	const acl = new Parse.ACL();
				// 	acl.setPublicWriteAccess(false);
				// 	acl.setPublicReadAccess(true);
				// 	acl.setWriteAccess(Parse.User.current().id, true);
				// 	looks.setACL(acl);
				// }
				// const data = await looks.save(null, Parse.User.current());
				const data = await looksInstance.save(null);
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
		Parse.Cloud.define("post_looks", async (req) => {
			try {
				const data = await this.post_looks(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
