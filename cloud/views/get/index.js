const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");
const shopifyInstance = require("../../utils/shopify-instance");

module.exports = {
  get_views: async ({ params, user }) => {
    const { shop } = params;
    if (exists(shop)) {
      try {
        const viewsQuery = parseUtils.query("Views");
        viewsQuery.equalTo("shop", shop);
        let viewsInstance = await viewsQuery.first({ useMasterKey: true });
        if (viewsInstance) {
          return {
            count: viewsInstance.get("count"),
            shop,
            subscribed: viewsInstance.get("subscribed"),
          };
        } else {
          return {
            count: 0,
            shop,
            subscribed: viewsInstance.get("subscribed"),
          };
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
    Parse.Cloud.define("get_views", async (req) => {
      try {
        const data = await this.get_views(req);
        return { data };
      } catch (e) {
        throw e;
      }
    });
  },
};
