export const sendTx = async (network, address, amount) => {

    const fetchURL = `/api/send/${network}/${address}?amount=${encodeURIComponent(amount)}`
    console.log(fetchURL)
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) throw new Error('transaction failed');

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(`Failed to send transaction to '${address}' on ${network} testnet for ${amount}`)
        return { error: err.message }
    }
};

export const getReceipt = async (network, hash) => {
    const fetchURL = `/api/receipt/${network}/${hash}`
    console.log(fetchURL)
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) throw new Error('receipt fetch error');

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(`Failed to fetch tx receipt for ${hash} on ${network}`)
        return { error: err.message }
    }
};

export const getBalance = async () => {
    const fetchURL = `/api/balance`
    try {
        const response = await fetch(fetchURL);
        if (!response.ok) throw new Error(`error getting balance`);

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(`Failed to fetch balance for available fund`)
        return { error: err.mesasge }
    }
}

export const getTx = async () => {
    const fetchURL = `/api/transactions`
    try {
        const response = await fetch(fetchURL);

        if (!response.ok) throw new Error(`${response.json()}`);

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(`Fialed to fetch Transactions History`)
        return { error: err.message }
    }
}