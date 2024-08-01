import React, { useState, useRef } from 'react';

import { useSearch } from '../cont/searchContext';

import Focus from './Receipt'
import focusIcon from '../assets/eye.png'
import scanUrl from '../util/scan';

function Tx({ apiRes, icon }) {
    const { searchParams, updateSearchParams } = useSearch()
    const [isOpen, setOpen] = useState(false)
    const focusedHash = useRef()

    const copyString = (string) => {
        navigator.clipboard.writeText(string)
        console.log(`copied ${string} to keyboard`)
    }

    const formatAdd = (add) => {
        try {

            const first = add.slice(0, 10);
            const last = add.slice(-8);

            return `${first}...${last}`
        } catch (err) {
            return `*undefined*`
        }

    }

    // const handleFocus = (hash) => {
    //     focusedHash.current = hash
    //     console.log(focusedHash.current)
    //     if (focusedHash.current !== (undefined || null)) {
    //         setOpen(!isOpen)
    //         // document.getElementById('focus-view').classList.toggle('is-active')
    //     }
    // }

    const etherscanAdd = `${scanUrl[searchParams.network]}address/${apiRes?.response?.sentTx?.to}`

    const etherscanHash = `${scanUrl[searchParams.network]}tx/${apiRes?.response?.sentTx?.hash}`

    // useEffect(() => {
    //     if (focusedHash) {
    //         console.log(focusedHash)

    //     }
    // }, [focusedHash, handleFocus, setHash])


    return (
        <>
            {!apiRes ? <>loading</> : (!apiRes?.response.sentTx) ? <div className='card '><div className='card-content '>
                <div className="content ">

                    <div>
                        "Error getting response.sentTx from API"

                    </div>
                </div>
            </div>
            </div> :
                <div className={`column is-two-fifths is-flex is-justify-content-center is-align-items-center`}>
                    <table className="table is-justify-content-center is-align-items-center is-narrow is-bordered is-striped is-hoverable">

                        <tbody className="is-vcentered">


                            <tr >
                                {/* <th>{new Date(tx.metadata.blockTimestamp).toString()}</th> */}
                                <th>Tx Hash</th>
                                <td
                                    className="has-tooltip-arrow has-tooltip-right has-tooltip-link"
                                    data-tooltip={apiRes.response.sentTx.hash}
                                    onClick={() => copyString(apiRes.response.sentTx.hash)}>
                                    <span className="is-align-item-center">
                                        <span>{`${apiRes.response.sentTx.hash.slice(0, 10)}... `}</span>
                                        <a href={etherscanHash} className="is-pulled-right pl-1 pr-2" target="_blank" rel="noreferrer">
                                            <span className="icon is-small is-align-self-center" ><img src={icon} /></span>
                                        </a>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>To Address</th>
                                <td
                                    className="has-tooltip-arrow"
                                    data-tooltip={apiRes.response.sentTx.to}
                                    onClick={() => copyString(apiRes.response.sentTx.to)}>
                                    <span className="is-align-item-center">
                                        <span>{formatAdd(apiRes.response.sentTx.to)}</span>
                                        <a href={etherscanAdd} className="is-pulled-right pl-3 pr-2" target="_blank" rel="noreferrer">
                                            <span className="icon is-small is-align-self-center"  ><img src={icon} /></span>
                                        </a>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th>Nonce</th>
                                <td>{apiRes.response.sentTx.nonce}</td>
                            </tr> 
                            <tr>
                                <th>Max Priority Fee Per Gas</th>
                                <td>{apiRes.response.sentTx.maxPriorityFeePerGas} Gwei</td>
                            </tr>
                            <tr>
                                <th>Max Fee Per Gas</th>
                                <td>{apiRes.response.sentTx.maxFeePerGas} Gwei</td>
                            </tr>
                            <tr>
                                <th>Gas Limit</th>
                                <td>{apiRes.response.sentTx.gasLimit} Wei</td>
                            </tr>



                        </tbody>
                    </table>
                    {/* {isOpen ? <div className="modal is-active" id="focus-view">
                        <Focus net={searchParams.network} hash={focusedHash.current} setOpen={setOpen} icon={icon} />
                    </div> : <></>} */}
                </div>
            }
        </>
    )
}

export default Tx;