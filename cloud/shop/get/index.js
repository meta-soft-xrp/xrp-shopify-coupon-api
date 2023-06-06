const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");

module.exports = {
  get_shop: async ({ params }) => {
    const { shop } = params;

    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        const shopInstance = await shopQuery.first({ useMasterKey: true });


        if (shopInstance) {
          return {
            shop: shopInstance.get('shop'),
            walletAddress: shopInstance.get('walletAddress'),
            accessToken: shopInstance.get('accessToken')
          }

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
    Parse.Cloud.define('get_shop', async (req) => {
      try {
        const { data } = await this.get_shop(req);
        return data;
      } catch (e) {
        throw e
      }
    })
  }
} 