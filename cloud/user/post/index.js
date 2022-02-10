const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const generator = require("generate-password");
const { exists } = require('../../utils/validate')
module.exports = {
	post_user: async ({ params }) => {
		const {
			username
		} = params;
		if (exists(username)) {
			try {
				const user = new Parse.User();
				const password = generator.generate({ length: 25, numbers: true });
				const signedUpUser = await user.signUp({
					username,
					password,
				});
				if (signedUpUser) {
					return {
						sessionToken: signedUpUser.get("sessionToken"),
						id: signedUpUser.id,
					};
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
		Parse.Cloud.define("post_user", async (req) => {
			try {
				const data = await this.post_user(req);
				return { data };
			} catch (e) {
				throw e;
			}
		});
	},
};
