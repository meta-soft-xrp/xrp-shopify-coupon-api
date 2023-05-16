const shopifyInstance = require("../../utils/shopify-instance");
const { exists } = require("../../utils/validate");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { get_views } = require("../../views/get");
module.exports = {
  delete_charges: async ({ params, user }) => {
    const { shop, chargeId } = params;
    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        let shopInstance = await shopQuery.first({ useMasterKey: true });
        if (shopInstance) {
          const shopifyNodeInstance = shopifyInstance({
            shopName: shop,
            accessToken: shopInstance.get("accessToken"),
          });
          const deletedCharge =
            await shopifyNodeInstance.recurringApplicationCharge.delete(
              chargeId
            );
          return deletedCharge;
        } else {
          const { code, message } = errors.constructErrorObject(400);
          throw new Parse.Error(code, message);
        }
      } catch (e) {
        const { code, message } = errors.constructErrorObject(500);
        throw new Parse.Error(code, message);
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
  // patchCharge: async (req, res) => {
  //   try {
  //     const { berrysupportshopname, berrysupportshopaccesstoken } = req.headers;
  //     const { chargeId } = req.body;
  //     const { id } = req.params;
  //     const shopifyNodeInstance = shopifyInstance({
  //       shopName: berrysupportshopname,
  //       accessToken: berrysupportshopaccesstoken,
  //     });

  //     const recurringApplicationCharge = await shopifyNodeInstance.recurringApplicationCharge.get(
  //       chargeId
  //     );
  //     if (
  //       recurringApplicationCharge &&
  //       recurringApplicationCharge.id === chargeId &&
  //       recurringApplicationCharge.status === "accepted"
  //     ) {
  //       const recurringApplicationChargeActivation = await shopifyNodeInstance.recurringApplicationCharge.activate(
  //         chargeId,
  //         {
  //           id: chargeId,
  //           name: recurringApplicationCharge.name,
  //           api_client_id: recurringApplicationCharge.api_client_id,
  //           price: recurringApplicationCharge.price,
  //           status: recurringApplicationCharge.status,
  //           return_url: `${process.env.PRICING_CONFIRMATION_RETURN_URL}/plans`,
  //           billing_on: recurringApplicationCharge.created_at,
  //           created_at: recurringApplicationCharge.created_at,
  //           updated_at: recurringApplicationCharge.created_at,
  //           test: process.env.ENABLE_TEST_DUMMY_PAYMENTS === "true", //process.env.NODE_ENV === "DEV",
  //           activated_on: null,
  //           cancelled_on: null,
  //           decorated_return_url: `${process.env.PRICING_CONFIRMATION_RETURN_URL}/plans`,
  //         }
  //       );

  //       res.status(200).send(recurringApplicationChargeActivation);
  //     }
  //   } catch (e) {
  //     console.error(e.message);
  //     res.sendStatus(e.code || e.status || 500);
  //   }
  // },
  post_charges: async ({ params, user }) => {
    const { shop, returnURL } = params;
    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        let shopInstance = await shopQuery.first({ useMasterKey: true });
        if (shopInstance) {
          const shopifyNodeInstance = shopifyInstance({
            shopName: shop,
            accessToken: shopInstance.get("accessToken"),
          });
          const recurringApplicationCharge =
            await shopifyNodeInstance.recurringApplicationCharge.create({
              name: "PRO",
              price: parseFloat(4.99),
              return_url: returnURL,
              test: process.env.ENABLE_TEST_DUMMY_PAYMENTS === "true",
            });
          return recurringApplicationCharge;
        } else {
          const { code, message } = errors.constructErrorObject(400);
          throw new Parse.Error(code, message);
        }
      } catch (e) {
        console.error(e);
        console.error(e);
        const { code, message } = errors.constructErrorObject(500);
        throw new Parse.Error(code, message);
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },

  get_charges: async ({ params, user }) => {
    const { shop } = params;
    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        let shopInstance = await shopQuery.first({ useMasterKey: true });
        if (shopInstance) {
          const shopifyNodeInstance = shopifyInstance({
            shopName: shop,
            accessToken: shopInstance.get("accessToken"),
          });
          const [views, recurringApplicationCharges] = await Promise.all([
            get_views({ params: { shop } }),
            shopifyNodeInstance.recurringApplicationCharge.list(),
          ]);
          return { views, recurringApplicationCharges };
        } else {
          const { code, message } = errors.constructErrorObject(400);
          throw new Parse.Error(code, message);
        }
      } catch (e) {
        const { code, message } = errors.constructErrorObject(500);
        throw new Parse.Error(code, message);
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
  initRoutes(req, res) {
    Parse.Cloud.define("get_charges", async (req) => {
      try {
        const data = await this.get_charges(req);
        return { data };
      } catch (e) {
        console.error(e);
        const { code, message } = errors.constructErrorObject(500);
        throw new Parse.Error(code, message);
      }
    });
  },
};
