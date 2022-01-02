import React, { createContext, useState } from "react";

export const SearchBoxContext = createContext<[string, React.Dispatch<string>]>([null!, () => { }]);

export const SearchBoxContextProvider: React.FC = ({ children }) => {
    const state = useState("");
    return <SearchBoxContext.Provider value={state}>
        {children}
    </SearchBoxContext.Provider>
}