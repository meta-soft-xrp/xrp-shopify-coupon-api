const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");
const shopifyInstance = require("../../utils/shopify-instance");
const { XummSdk } = require("xumm-sdk");
const { Xrpl, xrpToDrops } = require("xrpl");
const { TxData } = require("xrpl-txdata");
const { get_shop } = require("../../shop/get");
require('dotenv').config();

module.exports = {
  get_xrp_payment: async ({ params, user }) => {
    const { id, shop } = params;

    if (exists(id, shop)) {
      try {
        // const Sdk = new XummSdk('14c05862-df25-48df-880d-179d55e4fa31', '13f2507a-6062-45e3-b25a-68d742797b64')
        const Sdk = new XummSdk(
          process.env.XUMM_API_KEY, process.env.XUMM_API_SECRET_KEY
        );
        const shopData = await get_shop({ params: { shop }});
        console.log(shopData.get('walletAddress'))
        
        const Verify = new TxData();
        const request = {
          txjson: {
            TransactionType: "Payment",
            Destination: shopData.get('walletAddress'),
            Amount: xrpToDrops("10"),
          },
        };
        const subscription = await Sdk.payload.createAndSubscribe(
          request,
          (event) => {
            if (Object.keys(event.data).indexOf("signed") > -1) {
              return event.data;
            }
          }
        );
        return {
          qr: subscription.created.refs.qr_png,
          status: subscription.created.refs.websocket_status
        // return true;
        }
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
