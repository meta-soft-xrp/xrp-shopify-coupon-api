
# XRP Shop API

The API is a NodeJS server built using ParseJS, MongoDB, Expressa and is hosted on AWS.

# Folder structure
  - .ebextensions
  - nginx
  - cloud
  - public
  - index.js
  - configuration files 

# Entry point

On ```pm2 node index.js``` 
 - The bootstrap function for XRP loads with API keys
 - Followed by the bootstrap function for Shopify store admin api.
 - Then the routes are initialised.

# Modules

The folder structure is organised into functional modules inside the cloud directory with ```cloud/main.js``` being the entry point.
 - bootstrap
 - charges
 - credit
 - coupons
 - looksxrp
 - nft
 - products
 - scripts
 - shop
 - nftdash
 - user
 - utils
 - views
 - xrp-payment

# Loader
Each module is loaded into view with a route access folder such as get/post
```
const get = require('./get/index');

module.exports = {
  initRoutes: () => {
    get.initRoutes();
  }
}
```

# XUMM SDK
To initialise XUMM load API and Secret via .env files
```
const Sdk = new XummSdk(
    process.env.XUMM_API_KEY,
    process.env.XUMM_API_SECRET_KEY
);
```

# Payment with XRP
To create a new payment with XRP we create a new TX data with XRP and then load the TX data to Xumm sdk so it generates a QR code for payment
We also support Ledger device as well as a client payment method.

```
 const Verify = new TxData();
    const request = {
        txjson: {
        TransactionType: "Payment",
        Destination: shopData.walletAddress,
        Amount: xrpToDrops(lookPrice.get("xrpPrice")),
        // Amount: dropsToXrp
        },
    };
    const subscription = await Sdk.payload.createAndSubscribe(
        request,
        (event) => {
        if (Object.keys(event.data).indexOf("signed") > -1) {
            return event.data;
        }
        }
    );
    return {
        qr: subscription.created.refs.qr_png,
        status: subscription.created.refs.websocket_status,
        walletAddress: shopData.walletAddress,
    };
```

# Verifiy payments with Tx data

```
const Verify = new TxData();
const VerifiedResult = await Verify.getOne(txid);
```

# Generating coupon code via Shopify after payment via Xumm

We integrate XRP, and Shopify via Xumm to generate discount coupons and create product checkouts on Shopify store

```
const shopifyNodeInstance = shopifyInstance({
    shopName: shop,
    accessToken: shopInstance.get("accessToken"),
});

const getPriceRuleId = async ({ targetType, value }) => {
    const { id: priceRuleId } =
        await shopifyNodeInstance.priceRule.create({
        target_selection: "all",
        allocation_method:
            targetType === "shipping_line" ? "each" : "across",
        customer_selection: "all",
        starts_at: new Date().toISOString(),
        ends_at: new Date(
            ((d) => d.setFullYear(d.getFullYear() + 1))(new Date())
        ).toISOString(),
        once_per_customer: true,
        target_type:
            targetType === "shipping_line"
            ? "shipping_line"
            : "line_item",
        title: new Date().toGMTString() + " - " + "XRP Coupon Discount",
        value: targetType === "shipping_line" ? "-100" : `-${value}`,
        value_type:
            targetType === "shipping_line" ? "percentage" : targetType,
        });
    return priceRuleId;
};

const { targetType, value } = {
    targetType: "percentage",
    value: 100,
};

const data = await getPriceRuleId({ targetType, value });
```

# Adding XRP and Xumm payment widget to Shopify store

We utilise the scripts API to add XRP payment widget to Shopify storefront

```
const shopifyNodeInstance = shopifyInstance({
    shopName: shop,
    accessToken: shopInstance.get('accessToken'),
});
const existingShopifyScriptTags = await shopifyNodeInstance.scriptTag.list();
await Promise.all(existingShopifyScriptTags.map(async tag => await shopifyNodeInstance.scriptTag.delete(tag.id)))
const scriptInstance = await shopifyNodeInstance.scriptTag.create({
    event: "onload",
    src: `${process.env.API_SHOPLOOKS_WIDGET_URL}` // dont add ?shop query param here as Shopify will add by default
});
return scriptInstance;
```








## Features

- Pay with XRP ✅
- NFT Dashboard API - WIP
- NFT Checkout on Store - WIP
- Credit and borrowing - WIP


## Screenshots
![Xumm Screenshot](https://github.com/meta-soft-xrp/xrp-shopify-coupon-widget/raw/main/public/screenshoot3.png)
![App Screenshot](https://raw.githubusercontent.com/meta-soft-xrp/xrp-shopify-coupon-client/main/public/create_look.png)
![App Screenshot](https://github.com/meta-soft-xrp/xrp-shopify-coupon-client/raw/main/public/add_look_price.png)
![App Screenshot](https://github.com/meta-soft-xrp/xrp-shopify-coupon-client/raw/main/public/transaction.png)
![App Sscreenshot](https://github.com/meta-soft-xrp/xrp-shopify-coupon-widget/raw/main/public/payment-modal.png)

## Roadmap

- NFT Dashboard API - WIP
- NFT Checkout on Store - WIP
- Credit and borrowing - WIP



## Run Locally

Clone the project

```bash
  git clone https://github.com/meta-soft-xrp/xrp-shopify-coupon-api
```

Go to the project directory

```bash
  cd xrp-shopify-coupon-api
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  NODE_ENV=DEV node index.js
```

