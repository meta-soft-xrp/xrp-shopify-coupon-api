const post = require('./post/index');
const destroy = require('./destroy/index');

module.exports = {
  initRoutes: () => {
    post.initRoutes();
    destroy.initRoutes();
  }
}
