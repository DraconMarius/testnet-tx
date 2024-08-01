import React, { useState, useEffect } from 'react';

import { useSearch } from './searchContext';

import Tx from '../comp/Tx';
import Receipt from '../comp/Receipt'


function TxCont({ apiRes, icon }) {
    const { searchParams } = useSearch()


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
                        {`${apiRes.response.net} TestNet`}
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