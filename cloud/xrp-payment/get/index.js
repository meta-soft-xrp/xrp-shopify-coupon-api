const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");
const shopifyInstance = require("../../utils/shopify-instance");
const { XummSdk } = require("xumm-sdk");
const { Xrpl, xrpToDrops } = require("xrpl");
const { TxData } = require("xrpl-txdata");
require('dotenv');

module.exports = {
  get_xrp_payment: async ({ params, user }) => {
    const { id, shop } = params;

    if (exists(id, shop)) {
      try {
        // if (!ids.length) {
        // 	return []
        // }
        // const shopQuery = parseUtils.query('Shop');
        // shopQuery.equalTo('shop', shop);
        // let shopInstance = await shopQuery.first({ useMasterKey: true });
        // if (shopInstance) {
        // 	const shopifyNodeInstance = shopifyInstance({
        // 		shopName: shop,
        // 		accessToken: shopInstance.get('accessToken'),
        // 	});
        // 	const products = await shopifyNodeInstance.product.list({ ids: ids.join(',') });
        // 	return products
        // } else {
        // 	const { code, message } = errors.constructErrorObject(400);
        // 	throw new Parse.Error(code, message);
        // }
        console.log(id, shop);
        console.log(process.env.XUMM_API_KEY)
        const Sdk = new XummSdk(
          "14c05862-df25-48df-880d-179d55e4fa31",
          "13f2507a-6062-45e3-b25a-68d742797b64"
        );
        const Sdk1 = new XummSdk()
        const Verify = new TxData();
        const request = {
          txjson: {
            TransactionType: "Payment",
            Destination: "rEDtgTeQZwv6Bf1eYgtBraP4jsSQdZv42C",
            Amount: xrpToDrops("10"),
          },
        };
        const subscription = await Sdk1.payload.createAndSubscribe(
          request,
          (event) => {
            console.log(event.data);
            if (Object.keys(event.data).indexOf("signed") > -1) {
              return event.data;
            }
          }
        );
        console.log(subscription.created.refs.qr_png);
        return subscription.created.refs.qr_png;
        // return true;
      } catch (e) {
        console.error(e.message);
        throw e;
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
  initRoutes(req, res) {
    Parse.Cloud.define("get_xrp_payment", async (req) => {
      try {
        const data = await this.get_xrp_payment(req);
        return { data };
      } catch (e) {
        throw e;
      }
    });
  },
};
