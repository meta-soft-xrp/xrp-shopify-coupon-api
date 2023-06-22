const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate")

module.exports = {
    get_badge: async ({ params }) => {
        const { id } = params;

        if (exists(id)) {
            try {

            } catch (e) {
                throw e;
            }
        } else {
            const { code, message } = errors.constructErrorObject(400);
            throw new Parse.Error(code, message);
        }
    },
    initRoutes(req, res) {
        Parse.Cloud.define('get_badge', async (req) => {
            try {
                const { data } = await this.get_badge(req);
                return data;
            } catch (e) {
                throw e
            }
        })
    }
} 