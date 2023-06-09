const { exists } = require("../../utils/validate/index");
const errors = require("../../utils/error-handling/index");
const parseUtils = require("../../utils/parse-utils/index");
const xrpl = require("xrpl");

module.exports = {
    transfer_nft: async ({ params }) => {
        const { seed, tokenID, flags, amount, expiration, destination } = params;

        const net = "wss://s.altnet.rippletest.net:51233"
        const client = new xrpl.Client(net)
        await client.connect()
        const standby_wallet = xrpl.Wallet.fromSeed(seed)

        console.log(standby_wallet)
        console.log("Connected")
        if (seed) {
            console.log(seed + " SeeD")
            try {
                const net = "wss://s.altnet.rippletest.net:51233"
                const client = new xrpl.Client(net)
                await client.connect()
                const standby_wallet = xrpl.Wallet.fromSeed(seed)

                console.log(standby_wallet)

                //----------- Prepare expiration -----------//
                var expirationDate = null

                var days = parseInt(expiration)
                let d = new Date()
                d.setDate(d.getDate() + parseInt(days))
                var expirationDate = xrpl.isoTimeToRippleTime(d)

                console.log(amount, "amount")

                //------------------------- Prepare transaction ---------------------------
                let transactionBlob = {
                    "TransactionType": "NFTokenCreateOffer",
                    "Account": standby_wallet.classicAddress,
                    "NFTokenID": tokenID,
                    "Amount": amount,
                    "Flags": parseInt(flags),
                }



                // if (expirationDate != null) {
                //     transactionBlob.Expiration = expirationDate
                //     transactionBlob.Destination = destination
                // }
                console.log("TRANSACTIONBLOB out if", transactionBlob)


                const tx = await client.submitAndWait(transactionBlob, { wallet: standby_wallet })

                console.log("TNX", tx)

                let nftSellOffers;
                try {
                    nftSellOffers = await client.request({
                        method: "nft_sell_offers",
                        nft_id: tokenID
                    })
                } catch (err) {
                    nftSellOffers = "No sell offers."
                    console.log("Error", err)
                }

                console.log("NFT sell offers", nftSellOffers)

                return nftSellOffers;

            }
            catch (e) {
                const { code, message } = errors.constructErrorObject(
                    e.code || e.statusCode || 500,
                    e
                );
                throw new Parse.Error(code, message);
            }
        } else {
            const { code, message } = errors.constructErrorObject(400);
            throw new Parse.Error(code, message);
        }
    },
    initRoutes(req, res) {
        Parse.Cloud.define("transfer_nft", async (req) => {
            try {
                const data = await this.transfer_nft(req);
                return { data };
            } catch (e) {
                throw e;
            }
        });
    },
};
