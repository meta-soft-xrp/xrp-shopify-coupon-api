const errors = require("../../utils/error-handling/index");
const { exists } = require("../../utils/validate");
module.exports = {
  post_user: async ({ params }) => {
    const { username, password } = params;
    if (exists(username, password)) {
      try {
        const user = new Parse.User();
        const signedUpUser = await user.signUp({
          username,
          password,
        });
        if (signedUpUser) {
          return {
            sessionToken: signedUpUser.get("sessionToken"),
            id: signedUpUser.id,
          };
        } else {
          const { code, message } = errors.constructErrorObject(400);
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
    Parse.Cloud.define("post_user", async (req) => {
      try {
        const data = await this.post_user(req);
        return { data };
      } catch (e) {
        throw e;
      }
    });
  },
};
