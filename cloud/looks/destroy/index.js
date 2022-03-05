const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require('../../utils/validate');

module.exports = {
	destroy_looks: async ({ params, user }) => {
		const {
			id = '',
		} = params;
		if (exists(id)) {
			try {
				const looksInstance = parseUtils.instance('Looks')
				looksInstance.id = id;
				// const data = await looks.destroy(Parse.User.current());
				const data = await looksInstance.destroy();
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
		Parse.Cloud.define("destroy_looks", async (req) => {
			try {
				const data = await this.destroy_looks(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
