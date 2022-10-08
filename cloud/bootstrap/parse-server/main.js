const user = require("../../user/index");
const products = require("../../products/");
const scripts = require("../../scripts");
const looks = require("../../looks");
const xrpPayment = require("../../xrp-payment");
const coupon = require("../../coupon");

user.initRoutes();
products.initRoutes();
scripts.initRoutes();
looks.initRoutes();
xrpPayment.initRoutes();
coupon.initRoutes();
