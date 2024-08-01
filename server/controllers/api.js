const router = require('express').Router();
const { Alchemy, Network, Wallet, Utils } = require('alchemy-sdk');

const Key = process.env.ALCHEMY_API_KEY;

const { calcAge } = require("../utils/age")

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


// testNet ::SEPOLIA / AMOY:: chainId from https://chainlist.org/
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
    const amount = `${req.query.amount}` || 0.0001; //curently hardcoded to 0.0001 if not provided
    console.log(amount)

    const sendTestTx = async (net, chosenConfig, toAddress, chosenChainId, amount) => {

        const alchemy = new Alchemy(chosenConfig);
        let wallet = new Wallet(process.env.SECRET_KEY);

        try {
            //to get transaction count
            const nonce = await alchemy.core.getTransactionCount(
                wallet.address, "pending"
            )
            console.log(`${nonce} <- nonce`)
            let tx = {
                to: toAddress,
                value: Utils.parseEther(amount),
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

    const convertBigNumbers = (tx) => {
        return {
            ...tx,
            value: Utils.formatEther(tx.value),
            maxPriorityFeePerGas: Utils.formatUnits(tx.maxPriorityFeePerGas, 'gwei'),
            maxFeePerGas: Utils.formatUnits(tx.maxFeePerGas, 'gwei'),
            gasLimit: Utils.formatUnits(tx.gasLimit, 'wei')
        };
    };

    try {
        const response = await sendTestTx(chosenNet, chosenConfig, toAddress, chosenChainId, amount)
        // console.log(response);

        const convertedRes = {
            ...response,
            sentTx: convertBigNumbers(response.sentTx)
        }
        res.json({ response: convertedRes })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err })
    }

})

router.get('/receipt/:net/:hash', async (req, res) => {
    console.log('==============/Receipt==============')

    const chosenNet = req.params.net
    const chosenConfig = configs[chosenNet];
    console.log(chosenConfig)
    const hash = req.params.hash;

    const fetchReceipt = async (net, chosenConfig, hash) => {
        const alchemy = new Alchemy(chosenConfig);
        try {
            const receipt = await alchemy.transact.waitForTransaction(hash)
            return {
                net: net,
                receipt: receipt
            }
        } catch (err) {
            console.error(`Failed to fetch Receipt`, err);
            throw new Error(err.message)
        };
    };
    const convertBigNumbers = (results) => {
        return {
            ...results,
            cumulativeGasUsed: results?.cumulativeGasUsed ? Utils.formatUnits(results?.cumulativeGasUsed, 'gwei') : "pending",
            gasUsed: results?.gasUsed ? Utils.formatUnits(results?.gasUsed, 'wei') : "pending",
            effectiveGasPrice: results?.effectiveGasPrice ? Utils.formatUnits(results?.effectiveGasPrice, 'gwei') : "pending"
        };
    };

    try {
        const results = await fetchReceipt(chosenNet, chosenConfig, hash);
        const convertedRes = {
            ...results,
            receipt: convertBigNumbers(results.receipt)
        }
        res.json(convertedRes);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    };
});

router.get('/balance', async (req, res) => {
    console.log('==============/Wallet/Balance==============')

    const fetchBalance = async (net, config) => {
        const alchemy = new Alchemy(config);
        let wallet = new Wallet(process.env.SECRET_KEY);
        try {

            const balances = await alchemy.core.getBalance(wallet.address)

            return {
                net: net,
                balance: Utils.formatEther(balances)
            }
        } catch (err) {
            console.error(`Failed to fetch Balance`, err);
            throw new Error(err.message)
        }
    };

    try {
        const results = await Promise.all(
            Object.entries(configs).map(([net, config]) =>
                fetchBalance(net, config))
        )
        // console.log(results);
        res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    };
});

router.get('/transactions', async (req, res) => {

    console.log('==============/Transactions/Total==============')

    const wallet = new Wallet(process.env.SECRET_KEY);
    // const order = req.query.order || "desc"

    // const createParams = (pageKey, otherOpts) => {
    //     if (pageKey) {
    //         return { ...otherOpts, pageKey: pageKey }
    //     } else return otherOpts;
    // };

    const inboundParams = {
        order: "desc",
        toAddress: wallet.address,
        excludeZeroValue: true,
        category: ["external"],
        maxCount: 10,
        withMetadata: true
    };

    const outboundParams = {
        order: "desc",
        fromAddress: wallet.address,
        excludeZeroValue: true,
        category: ["external"],
        maxCount: 10,
        withMetadata: true
    };


    const fetchTransaction = async (net, config, option) => {
        const params = option === "outbound" ? outboundParams : inboundParams;
        const alchemy = new Alchemy(config);

        try {
            const transactions = await alchemy.core.getAssetTransfers(params);
            return transactions.transfers || [];
        } catch (err) {
            console.error(`Failed to fetch Transaction in function`, err);
            return { error: err.message };
        }
    };

    const mergeAndSortTransactions = async (outTransactions, inTransactions) => {
        const outTransfers = outTransactions || [];
        const inTransfers = inTransactions || [];

        const combined = [
            ...outTransfers?.map(t => ({
                ...t,
                metadata: {
                    ...t.metadata,
                    age: calcAge(t.metadata.blockTimestamp)
                }
            })),
            ...inTransfers?.map(t => ({
                ...t,
                metadata: {
                    ...t.metadata,
                    age: calcAge(t.metadata.blockTimestamp)
                }
            }))
        ];

        combined.sort((a, b) => new Date(b.metadata.blockTimestamp) - new Date(a.metadata.blockTimestamp));

        return combined;
    };

    try {
        const results = await Promise.all(
            Object.entries(configs).map(async ([net, config]) => {
                const [inNetworkRes, outNetworkRes] = await Promise.all([
                    fetchTransaction(net, config, "inbound"),
                    fetchTransaction(net, config, "outbound")
                ]);

                const sortedRes = await mergeAndSortTransactions(outNetworkRes, inNetworkRes);

                return { [net]: sortedRes };
            })
        );

        const combinedResults = results.reduce((net, transaction) => ({ ...net, ...transaction }), {});


        res.json(combinedResults)

    } catch (err) {
        console.error("Failed to fetch Transactions @ Promise", err);
        res.status(500).json({ error: err.message })
    }


})

module.exports = router;