import React, { useState, useEffect } from 'react';


import { getReceipt } from '../util/api'

import loadingIcon from '../assets/loading.gif'
import scanUrl from '../util/scan';

function Receipt({ net, hash, icon }) {
    const [isLoading, setLoading] = useState();
    const [receipt, setReceipt] = useState(null);

    const formatAdd = (add) => {
        try {

            const first = add.slice(0, 10);
            const last = add.slice(-8);

            return `${first}...${last}`
        } catch (err) {
            return `*undefined*`
        }

    }

    useEffect(() => {
        async function fetchReceipt() {
            setLoading(true);
            console.log(`hash: ${hash}`)
            try {
                if (hash) {

                    const data = await getReceipt(net, hash)
                    setReceipt(data)
                }

            } catch (err) {

                console.log(err)
            }



            setLoading(false)


        };

        if (net && hash) {
            fetchReceipt();
        }
    }, [hash])

    useEffect(() => {
        console.log(receipt)
    }, [receipt])


    return (
        <>

            {(!isLoading && receipt?.receipt) ?
                <div className="column is-two-fifths is-flex is-justify-content-center is-align-items-center">


                    <table className="table is-justify-content-center  is-align-items-center is-bordered is-striped is-narrow is-hoverable">
                        <tbody>
                            <tr>
                                <th>Status</th>
                                {(receipt.receipt.status === 1) ? <td><div className="tag is-success">Success</div></td> :
                                    <td><div className="tag is-danger">Failure</div></td>}
                            </tr>
                            <tr>
                                <th className=""> Tx Index</th>
                                {(receipt.receipt.transactionIndex) ? <td>{receipt.receipt.transactionIndex}</td> :
                                    <td><div className="tag is-danger">Pending</div></td>}
                            </tr>
                            <tr>
                                <th className=""> Block # </th>
                                <td>{receipt.receipt.blockNumber} <div className="tag is-info">{`${receipt.receipt.confirmations} Confirmations`}</div></td>
                            </tr>
                            {receipt.receipt.to ?
                                <tr>
                                    <th className=""> TO: </th>
                                    <td
                                        className="has-tooltip-arrow"
                                        data-tooltip={receipt.receipt.to}>
                                        <span className="is-align-item-center">
                                            <span>{formatAdd(receipt.receipt.to) || `contract creation`}</span>
                                            <a href={`${scanUrl[net]}address/${receipt.receipt.to}`} className="is-pulled-right pl-3 pr-2" target="_blank" rel="noreferrer">
                                                <span className="icon is-small is-align-self-center"  ><img src={icon} /></span>
                                            </a>
                                        </span>
                                    </td>
                                </tr> : <tr>
                                    <th className="">Contract Address</th>
                                    <td>{receipt.receipt.contractAddress}</td>
                                </tr>
                            }
                            <tr>
                                <th className=""> FROM: </th>
                                <td
                                    className="has-tooltip-arrow"
                                    data-tooltip={receipt.receipt.from}>
                                    <span className="is-align-item-center">
                                        <span>
                                            {formatAdd(receipt.receipt.from)}
                                        </span>
                                    </span>
                                    <a href={`${scanUrl[net]}address/${receipt.receipt.from}`} className="is-pulled-right pl-3 pr-2" target="_blank" rel="noreferrer">
                                        <span className="icon is-small is-align-self-center"  ><img src={icon} /></span>
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th className=""> Type: </th>
                                <td>{receipt.receipt.type}</td>
                            </tr>
                            <tr>
                                <th className=""> Byzantium: </th>
                                <td>{receipt.receipt.byzantium ? <div className="tag is-success">True</div> :
                                    <div className="tag is-danger">False</div>}</td>
                            </tr>
                            <tr>
                                <th className=""> Cumulative Gas</th>
                                <td>{`${receipt.receipt.cumulativeGasUsed} Gwei`}</td>
                            </tr>
                            <tr>
                                <th className=""> Gas Price</th>
                                <td>{`${receipt.receipt.effectiveGasPrice, 16} Gwei`}</td>
                            </tr>
                            <tr>
                                <th className=""> Gas Used</th>
                                <td>{`${receipt.receipt.gasUsed} Wei`}</td>
                            </tr>
                        </tbody>
                    </table>

                </div> :
                <div className="container is-align-items-center is-justify-content-center is-flex">
                    <div className="image is-1by1 is-48x48">
                        <img src={loadingIcon} alt="loading gif" />
                    </div>
                    <div>Please wait until transaction receipt is populated...</div>
                </div>
            }

        </>
    );
};

export default Receipt;