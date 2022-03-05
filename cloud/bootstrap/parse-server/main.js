const user = require('../../user/index');
const products = require('../../products/');
const scripts = require('../../scripts');
const looks = require('../../looks');

user.initRoutes();
products.initRoutes();
scripts.initRoutes();
looks.initRoutes();