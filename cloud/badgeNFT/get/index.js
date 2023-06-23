const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate")

module.exports = {
    get_badge: async ({ params }) => {
        const { id } = params;

        if (exists(id)) {
            try {

                const badgesQuery = parseUtils.query("Badges");
                badgesQuery.equalTo("objectId", id)
                badgesQuery.descending("createdAt");
                const data = id ? await badgesQuery.first() : await badgesQuery.find();

                if (data.id === id) {
                    return {
                        name: data.get('name'),
                        description: data.get('description'),
                        image: data.get('image'),
                    }
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