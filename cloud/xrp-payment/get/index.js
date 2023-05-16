const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");
const shopifyInstance = require("../../utils/shopify-instance");
const { XummSdk } = require("xumm-sdk");
const { Xrpl, xrpToDrops, dropsToXrp } = require("xrpl");
const { TxData } = require("xrpl-txdata");
const { get_shop } = require("../../shop/get");
const { get_looks } = require("../../looks/get");

module.exports = {
  get_xrp_payment: async ({ params, user }) => {
    const { id, shop } = params;

    if (exists(id, shop)) {
      try {
        const Sdk = new XummSdk(
          process.env.XUMM_API_KEY,
          process.env.XUMM_API_SECRET_KEY
        );
        const look = await get_looks({ params: { shop, id } });
        const shopData = await get_shop({ params: { shop } });
        // console.log(shopData.get('walletAddress'))
        // console.log(look.get('xrpPrice'))
        // console.log(shopData.walletAddress)
        const Verify = new TxData();
        const request = {
          txjson: {
            TransactionType: "Payment",
            Destination: shopData.walletAddress,
            Amount: xrpToDrops(look.get("xrpPrice")),
            // Amount: dropsToXrp
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
          status: subscription.created.refs.websocket_status,
          walletAddress: shopData.walletAddress,
        };
      } catch (e) {
        console.error(e);
        const { code, message } = errors.constructErrorObject(e.code || 500);
        throw new Parse.Error(code, message);
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
  verify_xrp_payment: async ({ params }) => {
    const { txid } = params;
    if (exists(txid)) {
      try {
        const Verify = new TxData(["wss://s.altnet.rippletest.net:51233"], {
          AllowNoFullHistory: true,
        });
        const VerifiedResult = await Verify.getOne(txid);
        console.log("Verifide Result: ", VerifiedResult);
        return VerifiedResult;
      } catch (e) {
        const { code, message } = errors.constructErrorObject(400);
        throw new Parse.Error(code, message);
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
