import React, { useState, useEffect } from 'react';
import { useSearch } from './searchContext';
import TxCont from './TxCont';
import loadingIcon from '../assets/loading.gif';
import Nav from './Nav';
import { getReceipt, sendTx } from '../util/api';

function Disp() {
    const { searchParams, updateSearchParams } = useSearch();
    const [type, setType] = useState(searchParams.type || "default");
    const [apiRes, setApiRes] = useState();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState(searchParams.walletAdd);
    const [net, setNet] = useState(searchParams.network);
    const [amount, setAmount] = useState(searchParams.amount);

    const blankState = {
        network: 'Eth',
        walletAdd: '',
        type: 'default',
        amount: 0.00005
    };

    const handleSend = async (network, address, amount) => {
        const search = {
            ...blankState,
            network: network,
            walletAdd: address,
            amount: amount,
            type: "transaction"
        };
        await updateSearchParams(search);
    };

    useEffect(() => {
        setNet(searchParams.network);
        setAddress(searchParams.walletAdd);
        setAmount(searchParams.amount);
    }, [searchParams.walletAdd, searchParams.network, searchParams.amount]);

    useEffect(() => {
        console.log("Disp useEffect triggered with:", searchParams);
        async function fetchData() {
            setLoading(true);
            let data;
            if (searchParams.type === "transaction") {
                data = await sendTx(searchParams.network, searchParams.walletAdd, searchParams.amount);
                console.log("Fetched data:", data);
                setApiRes(data);
                setType("transaction");
                setLoading(false);
            } else if (searchParams.type === (null || undefined)) {
                setApiRes();
                setType("default");
                setLoading(false);
            }
        }

        if (searchParams.walletAdd && searchParams.network) {
            fetchData();
        }
    }, [searchParams, searchParams.network, searchParams.type, searchParams.amount, searchParams.walletAdd]);

    return (
        <div className="hero-background">
            {loading ? (
                <div className="modal is-active">
                    <div className="modal-background">
                        <div className="modal-content is-flex is-justify-content-center is-align-items-center">
                            <div className="image is-1by1 is-48x48">
                                <img src={loadingIcon} alt="loading gif" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <section className="hero is-fullheight">
                    <div className="hero-head">
                        <Nav setAddress={setAddress} />
                    </div>
                    <div className="hero-body ">
                        <div className="container has-text-centered">
                            <h1 className="title">TestNet Transactions: </h1>
                            <div className="container is-justify-content-center">
                                <div className="field is-grouped is-align-items-center is-justify-content-center">
                                    <div className="control">
                                        <h1 className="title">Send</h1>
                                    </div>
                                    <div className="control">
                                        <div className="select">
                                            <select value={amount} onChange={e => setAmount(e.target.value)}>
                                                <option value="0.1">0.1</option>
                                                <option value="0.5">0.5</option>
                                                <option value="1">1</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="control">
                                        <h1 className="title">of</h1>
                                    </div>
                                    <div className="control">
                                        <div className="select">
                                            <select value={net} onChange={e => setNet(e.target.value)}>
                                                <option value="Eth">ETH-Sepolia</option>
                                                <option value="Polygon">Polygon-AMOY</option>
                                                <option value="Arbitrum">ARB-Sepolia</option>
                                                <option value="Optimism">OPT-Sepolia</option>
                                                <option value="Base">BASE-Sepolia</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="control">
                                        <h1 className="title">to</h1>
                                    </div>
                                    <div className="control">
                                        <input
                                            name="walletAdd"
                                            className="input"
                                            type="text"
                                            onChange={e => setAddress(e.target.value)}
                                            value={searchParams.walletAdd || address}
                                            placeholder={searchParams.walletAdd || address || `Address`}
                                        />
                                    </div>
                                </div>
                                <div className="control is-justify-content-center">
                                    <button className="button is-primary" onClick={() => handleSend(net, address, amount)}>
                                        Initiate Transfer
                                    </button>
                                </div>
                            </div>
                            {apiRes?.error ? (
                                <>ERROR sending tx for {searchParams.walletAdd} on {searchParams.network} for {searchParams.amount}</>
                            ) : ((apiRes) ? (
                                <TxCont apiRes={apiRes} />
                            ) : (
                                <></>
                            )
                            )
                            }
                        </div>
                    </div>

                    <div className="hero-foot">
                        <nav className="tabs is-boxed is-fullwidth">
                            <div className="container pt-0">
                                <ul>
                                    <li>
                                        <a href="https://docs.alchemy.com" target="_blank" rel="noreferrer">Alchemy Docs</a>
                                    </li>
                                    <li>
                                        <a href="https://github.com/DraconMarius/testnet-tx" target="_blank" rel="noreferrer">Github</a>
                                    </li>
                                    <li>
                                        <a href="https://www.linkedin.com/in/mari-ma-70771585" target="_blank" rel="noreferrer">Contact</a>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </section>
            )

            }
        </div>
    );
}

export default Disp;