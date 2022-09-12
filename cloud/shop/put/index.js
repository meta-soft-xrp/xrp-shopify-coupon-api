const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");

module.exports = {
  put_shop: async ({ params, user }) => {
    const { shop, walletAddress } = params;
    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        const shopInstance = await shopQuery.first({ useMasterKey: true });
        if (shopInstance && walletAddress) {
          shopInstance.set("walletAddress", walletAddress);
          const savedShopInstance = await shopInstance.save(null, {
            useMasterKey: true,
          });
          return savedShopInstance;
        } else {
          const { code, message } = errors.constructErrorObject(404);
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
    Parse.Cloud.define("put_shop", async (req) => {
      try {
        const data = await this.put_shop(req);
        return { data };
      } catch (e) {
        throw e;
      }
    });
  },
};
