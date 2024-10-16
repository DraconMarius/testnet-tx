import React, { useState, useEffect } from 'react';
import { useSearch } from '../cont/searchContext';

import walletIcon from '../assets/walletConnect.png'
import loadingIcon from '../assets/loading.gif'

function Connect({ setAddress }) {
    const { updateSearchParams } = useSearch();
    const [providers, setProviders] = useState([]);
    const [addresses, setAddresses] = useState();
    const [selectedProv, setSelectedProv] = useState();
    const [walletDisp, setWalletDisp] = useState(false);
    const [btnDisp, setBtnDisp] = useState(false);

    useEffect(() => {
        const handleProviderAnnouncement = event => {
            const providerDetails = event.detail;
            setProviders(prev => [...prev, providerDetails]);
        };

        window.addEventListener('eip6963:announceProvider', handleProviderAnnouncement);
        window.dispatchEvent(new Event('eip6963:requestProvider'));

        return () => window.removeEventListener('eip6963:announceProvider', handleProviderAnnouncement);
    }, []);

    const handleConnect = async (account) => {
        try {
            setAddress(account)
            setWalletDisp(false);
        } catch (err) {
            console.error("Error updating param with selected account", err.message);
        }
    };

    const handleSelectProvider = async (providerDetail) => {
        try {
            const accounts = await providerDetail.provider.request({ method: 'eth_requestAccounts' });
            setAddresses(accounts)
            setSelectedProv(providerDetail)
        } catch (err) {
            console.error("Error getting accounts from provider", err.message)
        }
    }
    const clearSelected = () => {
        setAddresses()
        setSelectedProv()
    }

    useEffect(() => {
        console.log(providers)
        setBtnDisp(providers.length > 0);
    }, [providers]);

    return (
        <div className="container is-flex">
            {btnDisp && (
                <button className="has-text-weight-bold" onClick={() => setWalletDisp(true)}>
                    <div className="container is-flex">
                        <span className="pr-1 is-align-self-center">
                            Connect
                        </span>


                        <figure className="icon "> <img src={walletIcon} /></figure>

                    </div>

                </button>
            )}

            <div className={`modal ${walletDisp ? 'is-active' : ''}`}>
                <div className="modal-background" onClick={() => setWalletDisp(false)}></div>
                <div className={`modal-card ${addresses ? `helpCard` : ""}`}>
                    <div className="container">
                        <button className="delete is-pulled-right" aria-label="close" onClick={() => setWalletDisp(false)}></button>
                    </div>
                    <header className="modal-card-head is-align-item-center pb-4 pt-5">
                        <div className="modal-card-title is-align-item-center">
                            Detected {selectedProv ? `Address(es) in ${selectedProv.info.name}` : "Wallet(s)"}
                            <span className="icon-text">
                                <figure className="image is-32x32 pl-2">
                                    <img src={selectedProv ? selectedProv.info.icon : walletIcon} alt="icon" />
                                </figure>
                            </span>
                        </div>
                        {addresses ?
                            <button className="button is-pulled-right" onClick={() => clearSelected()}> {`Back`}</button> : <></>
                        }
                    </header>
                    <section className="modal-card-body">
                        {
                            (providers && !selectedProv && !addresses) ?
                                providers.map((provider, index) => (
                                    <div className="box is-flex is-justify-content-center" key={index}>
                                        <article className="media is-align-items-center">
                                            <figure className="media-left">
                                                <p className="image">
                                                    <img src={provider.info.icon} alt={`${provider.info.name} icon`} />
                                                </p>
                                            </figure>
                                            <div className="media-content">
                                                <div className="content">
                                                    <button className="button is-link" onClick={() => handleSelectProvider(provider)}>
                                                        {provider.info.name}
                                                    </button>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                )
                                ) : (providers && selectedProv && addresses) ?
                                    addresses.map((address, index) => (
                                        <div className="box is-justify-content-center is-flex" key={index} >
                                            <div className="button is-info" onClick={() => handleConnect(address)} >
                                                {address}
                                            </div>
                                        </div>
                                    )) :

                                    <></>
                        }
                    </section>
                </div >
            </div >
        </div >
    );
}

export default Connect;