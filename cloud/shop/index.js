const put = require("./put");
const get = require('./get');
module.exports = {
  initRoutes: () => {
    put.initRoutes();
    get.initRoutes();
  },
};
