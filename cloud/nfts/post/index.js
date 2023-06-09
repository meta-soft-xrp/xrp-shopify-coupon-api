const { exists } = require("../../utils/validate/index");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const xrpl = require("xrpl");

module.exports = {
    create_nft: async ({ params }) => {
        const { seed, uri, transferFee, flags, method } = params;

        if (exists(seed)) {
            if (method === "create") {
                try {
                    const net = "wss://s.altnet.rippletest.net:51233"
                    const client = new xrpl.Client(net)
                    await client.connect()
                    const standby_wallet = xrpl.Wallet.fromSeed(seed)

                    const transactionJson = {
                        "TransactionType": "NFTokenMint",
                        "Account": standby_wallet.classicAddress,
                        "URI": xrpl.convertStringToHex(uri),
                        "Flags": parseInt(flags),
                        "TransferFee": parseInt(transferFee),
                        "NFTokenTaxon": 0
                    }

                    // ----------------------------------------------------- Submit signed blob 
                    const tx = await client.submitAndWait(transactionJson, { wallet: standby_wallet })

                    console.log("TX", tx.result.meta)
                    const nfts = await client.request({
                        method: "account_nfts",
                        account: standby_wallet.classicAddress
                    })
                    return nfts;

                } catch (e) {
                    const { code, message } = errors.constructErrorObject(
                        e.code || e.statusCode || 500,
                        e
                    );
                    throw new Parse.Error(code, message);
                }
            }
            //----------- get token by seed -------------//
            else if (method === "get") {
                try {
                    const net = "wss://s.altnet.rippletest.net:51233"
                    const client = new xrpl.Client(net)
                    await client.connect()
                    const standby_wallet = xrpl.Wallet.fromSeed(seed);

                    const nfts = await client.request({
                        method: "account_nfts",
                        account: standby_wallet.classicAddress
                    })

                    return nfts;
                }
                catch (e) {
                    const { code, message } = errors.constructErrorObject(
                        e.code || e.statusCode || 500,
                        e
                    );
                    throw new Parse.Error(code, message);
                }
            }
        } else {
            const { code, message } = errors.constructErrorObject(400);
            throw new Parse.Error(code, message);
        }
    },
    initRoutes(req, res) {
        Parse.Cloud.define("create_nft", async (req) => {
            try {
                const data = await this.create_nft(req);
                return { data };
            } catch (e) {
                throw e;
            }
        });
    },
};
