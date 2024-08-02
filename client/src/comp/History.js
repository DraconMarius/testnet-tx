import React, { useState, useEffect } from 'react';
import { useSearch } from '../cont/searchContext';
import scanUrl from '../util/scan';

function History({ history, icon, setNet, net }) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const copyString = (string) => {
        navigator.clipboard.writeText(string);
        console.log(`copied ${string} to clipboard`);
    };

    const networks = Object.keys(history);

    useEffect(() => {
        setSelectedIndex(networks.indexOf(net))
    }, [net])

    useEffect(() => {
        setNet(networks[selectedIndex])
    }, [selectedIndex])

    if (!history) {
        return <p>No Transaction Data Available</p>;
    }


    return (
        <>
            {!history ? <>loading</> :
                <article className="block mt-3">
                    <div className="tabs is-centered  mb-0">
                        <ul>

                            {networks.map((network, index) => (
                                <li key={index}>
                                    <a
                                        onClick={() => setSelectedIndex(index)}
                                        aria-controls={`panel-${network}`}
                                        className={index === selectedIndex ? 'is-active' : ''}
                                    >
                                        {network}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="table-container">
                        <table className="table is-justify-content-center is-align-content-center is-bordered is-striped is-fullwidth is-hoverable is-narrow">
                            <thead>
                                <tr>
                                    <th title="Age">Age</th>
                                    <th><abbr title="Transaction Hash">Hash #</abbr></th>
                                    <th><abbr title="Block Number">Block</abbr></th>
                                    <th title="Type">Type</th>
                                    <th><abbr title="Tx Direction">Tx Dir</abbr></th>
                                    <th><abbr title="Address">Add #</abbr></th>
                                    <th><abbr title="Value and Assets">Val + Assets</abbr></th>
                                </tr>
                            </thead>
                            {networks.map((network, index) => (
                                <tbody
                                    key={index}
                                    id={`panel-${network}`}
                                    role="tabpanel"
                                    aria-labelledby={network}
                                    aria-hidden={index !== selectedIndex}
                                    style={{ display: index === selectedIndex ? 'table-row-group' : 'none' }}
                                >
                                    {history[network]?.length === 0 ? (
                                        <tr>
                                            <td colSpan="7">No Transaction Data</td>
                                        </tr>
                                    ) : history[network]?.map((tx, txIndex) => {
                                        const otherAdd = (tx.to !== "0xaede4d660c592da38ee986df4ef941b5acc4ea1a") ? tx.to : tx.from;
                                        const blockNum = parseInt(tx.blockNum, 16);
                                        const etherscanAdd = `${scanUrl[network]}address/${otherAdd}`;
                                        const etherscanHash = `${scanUrl[network]}tx/${tx.hash}`;
                                        const etherscanBlock = `${scanUrl[network]}block/${blockNum}`;

                                        const formatAdd = (add) => {
                                            try {
                                                const first = add.slice(0, 10);
                                                const last = add.slice(-8);
                                                return `${first}...${last}`;
                                            } catch (err) {
                                                return `*undefined*`;
                                            }
                                        };

                                        return (
                                            <tr key={txIndex}>
                                                <td
                                                    className="has-tooltip-arrow has-tooltip-right has-tooltip-danger"
                                                    data-tooltip={new Date(tx.metadata.blockTimestamp).toLocaleString()}
                                                >
                                                    {tx.metadata.age}
                                                </td>
                                                <td
                                                    className="has-tooltip-arrow has-tooltip-right has-tooltip-link"
                                                    data-tooltip={tx.hash}
                                                    onClick={() => copyString(tx.hash)}
                                                >
                                                    <span className="is-align-item-center">
                                                        <span>{`${tx.hash.slice(0, 10)}... `}</span>
                                                        <a href={etherscanHash} className="is-pulled-right pl-1 pr-2" target="_blank" rel="noreferrer">
                                                            <span className="icon is-small is-align-self-center"><img src={icon} alt="icon" /></span>
                                                        </a>
                                                    </span>
                                                </td>
                                                <td
                                                    className="is-clickable"
                                                    onClick={() => copyString(tx.blockNum)}
                                                >
                                                    <span className="is-align-item-center">
                                                        <span>{blockNum}</span>
                                                        <a href={etherscanBlock} className="is-pulled-right" target="_blank" rel="noreferrer">
                                                            <span className="icon is-small is-align-self-center"><img src={icon} alt="icon" /></span>
                                                        </a>
                                                    </span>
                                                </td>
                                                <td>{tx.category}</td>
                                                <td className="has-text-centered">
                                                    {("0xaede4d660c592da38ee986df4ef941b5acc4ea1a" === tx.from) ?
                                                        <div className="tag is-warning">TO</div> :
                                                        <div className="tag is-info">FROM</div>}
                                                </td>
                                                <td
                                                    className="has-tooltip-arrow"
                                                    data-tooltip={otherAdd}
                                                    onClick={() => copyString(otherAdd)}
                                                >
                                                    <span className="is-align-item-center">
                                                        <span>{formatAdd(otherAdd)}</span>
                                                        <a href={etherscanAdd} className="is-pulled-right" target="_blank" rel="noreferrer">
                                                            <span className="icon is-small is-align-self-center"><img src={icon} alt="icon" /></span>
                                                        </a>
                                                    </span>
                                                </td>
                                                <td className="is-align-content-center">
                                                    <span className="icon-text is-align-content-center">
                                                        <span>{tx.value}{` ${(tx.asset?.length > 15) ? `UNIT(s)` : tx.asset}`}</span>
                                                        {tx.mData ? (
                                                            <span className="icon is-small is-align-self-center"><img src={tx.mData.logo || null} alt="asset" /></span>
                                                        ) : null}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            ))}
                        </table>
                    </div>
                </article>
            }
        </>
    );
}

export default History;
