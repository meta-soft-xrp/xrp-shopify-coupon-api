const post = require("./post/index");
const get = require('./get/index');

module.exports = {
    initRoutes: () => {
        post.initRoutes();
        get.initRoutes();
    },
};