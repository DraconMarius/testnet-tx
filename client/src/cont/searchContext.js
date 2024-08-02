import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {

    const [searchParams, setSearchParams] = useState({
        network: 'Eth',
        walletAdd: '',
        type: 'default',
        amount: 0.1
    });

    const updateSearchParams = (newParams) => {
        setSearchParams((prev) => {

            return { ...prev, ...newParams };
        });
    };

    return (
        <SearchContext.Provider value={{ searchParams, updateSearchParams }}>
            {children}
        </SearchContext.Provider>
    );

};

export const useSearch = () => useContext(SearchContext);