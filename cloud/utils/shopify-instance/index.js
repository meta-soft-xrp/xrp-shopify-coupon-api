const ShopifyNodeApi = require('shopify-api-node');

const shopifyNodeInstance = ({
    shopName,
    accessToken,
    apiVersion= '2021-10'
}) => new ShopifyNodeApi({
    shopName,
    accessToken,
    apiVersion
});

module.exports = shopifyNodeInstance;