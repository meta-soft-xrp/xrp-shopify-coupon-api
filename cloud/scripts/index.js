const post = require('./post/index');
const destroy = require('./destroy/index');
const get = require('./get');
module.exports = {
  initRoutes: () => {
    post.initRoutes();
    destroy.initRoutes();
    get.initRoutes();
  }
}
