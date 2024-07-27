import React, { useState, useEffect } from 'react';

import { useSearch } from './searchContext';

import Tx from '../comp/Tx';
import Receipt from '../comp/Receipt'


import ethereumIcon from '../assets/etherscan-logo.png'
import arbitrumIcon from '../assets/arbitrum-logo.png'
import optimismIcon from '../assets/optimism-logo.png'
import polygonIcon from '../assets/polygon-logo.png'

function TxCont({ apiRes }) {
    const { searchParams } = useSearch()


    const [icon, setIcon] = useState()

    useEffect(() => {

        if (searchParams.network === "Polygon") {
            setIcon(polygonIcon)
        } else if (searchParams.network === "Arbitrum") {
            setIcon(arbitrumIcon)
        } else if (searchParams.network === "Optimism") {
            setIcon(optimismIcon)
        } else {
            setIcon(ethereumIcon)
        }

    }, [searchParams.network]);

    return (
        <div className='card transparent'>
            <div className="divider">
                <div>

                    <span className="is-tag highlight">
                        {`${searchParams.amount} ${(searchParams.network === 'Polygon') ? 'Amoy' : 'Sepolia'} `}
                    </span>

                    {` ${"sent to "} `}

                    <span className="highlight">
                        {apiRes.response.sentTx.to}
                    </span>

                    {" on "}

                    <span className="highlight">
                      { `${apiRes.response.net} TestNet`}
                    </span>

                </div>
            </div>

            {/* <div className="container">
                {apiRes.wAddress}
                <a href={etherscanWallet} target="_blank" rel="noreferrer" className="pl-3 is-align-self-center">
                    <span className="icon is-small is-align-self-center"  ><img src={icon} /></span>
                </a>
            </div> */}


            <div className="container ">

                <div className="columns is-centered">
                    <Tx apiRes={apiRes} icon={icon} />

                    <div className="divider is-vertical highlight">{`Receipt->`}</div>

                    <Receipt net={apiRes.response.net} hash={apiRes.response.sentTx.hash} icon={icon} />
                </div>

            </div>
        </div>

    )


}

export default TxCont;