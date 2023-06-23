const { exists } = require("../../utils/validate/index");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");

module.exports = {
    badge_nft: async ({ params }) => {
        const { title, description, image } = params;

        if (exists(title)) {
            try {
                console.log(title, description, image);
                const badgesInstance = parseUtils.instance('Badges')
                badgesInstance.set('name', title);
                badgesInstance.set('description', description);
                badgesInstance.set('image', image);

                const data = await badgesInstance.save(null);

                return data;
            }
            catch (err) { };
        } else {
            const { code, message } = errors.constructErrorObject(400);
            throw new Parse.Error(code, message);
        }
    },
    initRoutes(req, res) {
        Parse.Cloud.define("badge_nft", async (req) => {
            try {
                const data = await this.badge_nft(req);
                return { data };
            } catch (e) {
                throw e;
            }
        });
    },
};
