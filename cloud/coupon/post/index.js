const { exists } = require("../../utils/validate/index");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const generator = require("generate-password");
const shopifyInstance = require("../../utils/shopify-instance");

module.exports = {
  post_coupon: async ({ params }) => {
    const { shop, discount } = params;
    if (exists(shop)) {
      try {
        const shopQuery = parseUtils.query("Shop");
        shopQuery.equalTo("shop", shop);
        let shopInstance = await shopQuery.first({ useMasterKey: true });
        if (shopInstance) {
          console.log(shopInstance.get("accessToken"));
          const shopifyNodeInstance = shopifyInstance({
            shopName: shop,
            accessToken: shopInstance.get("accessToken"),
          });

          const getPriceRuleId = async ({ targetType, value }) => {
            try {
              const { id: priceRuleId } =
                await shopifyNodeInstance.priceRule.create({
                  title: "HBAR SHOP DISCOUNT " + Math.random(),
                  target_type: "line_item",
                  allocation_method: "across",
                  target_selection: "all",
                  customer_selection: "all",
                  starts_at: new Date().toISOString(),
                  once_per_customer: true,
                  title:
                    new Date().toGMTString() + " - " + "HBAR Payment Discount",
                  value: "-100",
                  value_type: "percentage",
                });
              return priceRuleId;
            } catch (e) {
              console.error("SDFSDFDSF ", e);
            }
          };

          const { targetType, value } = {
            targetType: "shipping_line",
            value: 100,
          };

          const priceRuleId = await getPriceRuleId({ targetType, value });

          //   const { priceRuleId = await getPriceRuleId({ targetType, value }) } = discount;

          //   if (targetType === "percentage") {
          //     const parsedDiscountValue = parseFloat(value, 10);
          //     if (parsedDiscountValue > 100 || parsedDiscountValue <= 0) {
          //       throw 400;
          //     }
          //   } else if (targetType === "fixed_amount") {
          //     const parsedDiscountValue = parseFloat(value, 10);
          //     if (parsedDiscountValue <= 0) {
          //       throw 400;
          //     }
          //   }

          if (priceRuleId) {
            const discountInstance = parseUtils.instance("Discount");
            discountInstance.set("priceRuleId", priceRuleId);
            discountInstance.set("targetType", targetType);
            discountInstance.set("discountValue", value);

            const code = generator.generate({
              symbols: false,
              uppercase: false,
              numbers: false,
              lowercase: true,
              excludeSimilarCharacters: true,
              length: 6,
              strict: true,
            });

            const discountCodeInstance =
              await shopifyNodeInstance.discountCode.create(priceRuleId, {
                code,
              });
            if (discountCodeInstance) {
              discountInstance.set("discount", discountCodeInstance);
              const acl = new Parse.ACL();
              acl.setPublicWriteAccess(false);
              acl.setPublicReadAccess(false);
              discountInstance.setACL(acl);
              const savedDiscount = await discountInstance.save(null);
              return savedDiscount;
            } else {
              const { code, message } = errors.constructErrorObject(400);
              throw new Parse.Error(code, message);
            }
          } else {
            const { code, message } = errors.constructErrorObject(400);
            throw new Parse.Error(code, message);
          }
        } else {
          const { code, message } = errors.constructErrorObject(400);
          throw new Parse.Error(code, message);
        }
      } catch (e) {
        const { code, message } = errors.constructErrorObject(
          e.code || e.statusCode || 500,
          e
        );
        throw new Parse.Error(code, message);
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
  initRoutes(req, res) {
    Parse.Cloud.define("post_coupon", async (req) => {
      try {
        const data = await this.post_coupon(req);
        return { data };
      } catch (e) {
        throw e;
      }
    });
  },
};
