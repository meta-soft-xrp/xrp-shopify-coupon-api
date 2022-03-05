const get = require('./get/index');
const post = require('./post/index');
const destroy = require('./destroy/index');

module.exports = {
  initRoutes: () => {
    get.initRoutes();
		post.initRoutes();
		destroy.initRoutes();
  }
}
