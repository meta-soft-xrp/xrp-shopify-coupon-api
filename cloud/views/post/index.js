const { get_charges } = require("../../charges/get");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const { exists } = require("../../utils/validate");

module.exports = {
  post_views: async ({ params, user }) => {
    const { shop, subscribed } = params;
    if (exists(shop)) {
      try {
        const viewsQuery = parseUtils.query("Views");
        viewsQuery.equalTo("shop", shop);
        let viewsInstance = await viewsQuery.first({ useMasterKey: true });
        if (viewsInstance) {
          viewsInstance.increment("count");
          if (subscribed === "true") {
            viewsInstance.set("subscribed", true);
          } else if (subscribed === "false") {
            viewsInstance.set("subscribed", false);
          }
          viewsInstance.save(null, { useMasterKey: true });
          return viewsInstance;
        } else {
          let newViewsInstance = parseUtils.instance("Views");
          newViewsInstance.set("shop", shop);
          newViewsInstance.set("count", 1);
          if (subscribed === "true") {
            newViewsInstance.set("subscribed", true);
          } else if (subscribed === "false") {
            newViewsInstance.set("subscribed", false);
          }
          const acl = new Parse.ACL();
          acl.setPublicWriteAccess(false);
          acl.setPublicReadAccess(true);
          newViewsInstance.setACL(acl);
          newViewsInstance.save(null, { useMasterKey: true });
          return newViewsInstance;
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    } else {
      const { code, message } = errors.constructErrorObject(400);
      throw new Parse.Error(code, message);
    }
  },
};
