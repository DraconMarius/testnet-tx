const router = require('express').Router();
const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk');

const Key = process.env.ALCHEMY_API_KEY;

const configs = {
    Eth: {
        apiKey: Key,
        network: Network.ETH_SEPOLIA
    },
    Polygon: {
        apiKey: Key,
        network: Network.MATIC_AMOY
    },
    Arbitrum: {
        apiKey: Key,
        network: Network.ARB_SEPOLIA
    },
    Optimism: {
        apiKey: Key,
        network: Network.OPT_SEPOLIA
    },
    Base: {
        apiKey: Key,
        network: Network.BASE_SEPOLIA
    }
};
// testNet SEPOLIA / AMOY chainId from https://chainlist.org/
const chainId = {
    Eth: 11155111,
    Polygon: 80002,
    Arbitrum: 421614,
    Optimism: 11155420,
    Base: 84532
}

router.get('/send/:net/:to', async (req, res) => {
    console.log('================sending testnet transaction================')

    const chosenNet = req.params.net;
    const chosenConfig = configs[chosenNet];
    const chosenChainId = chainId[chosenNet];
    const toAddress = req.params.to;

    const sendTestTx = async (net, chosenConfig, toAddress, chosenChainId) => {

        const alchemy = new Alchemy(chosenConfig);
        let wallet = new Wallet(process.env.SECRET_KEY);

        try {
            //to get transaction count
            const nonce = await alchemy.core.getTransactionCount(
                wallet.address, "latest"
            )
            console.log(`${nonce} <- nonce`)
            let tx = {
                to: toAddress,
                value: Utils.parseEther("0.0001"),
                gasLimit: "21000",
                maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
                maxFeePerGas: Utils.parseUnits("20", "gwei"),
                nonce,
                type: 2,
                chainId: chosenChainId
            }
            let rawTx = await wallet.signTransaction(tx);
            let sentTx = await alchemy.core.sendTransaction(rawTx)

            return {
                net: net,
                sentTx
            }
        } catch (err) {
            console.error(`Failed to send Tx on ${net} testnet`)
            throw new Error(err.message)
        }
    };

    try {
        const response = await sendTestTx(chosenNet, chosenConfig, toAddress, chosenChainId)
        console.log(response);
        res.json({ response })

    } catch (err) {
        console.log("error occured", err.message)
        res.status(500).json({ error: err.message })
    }

})

module.exports = router;