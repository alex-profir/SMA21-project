import React from "react"
import { CustomFC, isFunction } from ".";
import { useSelector } from "../../store";
export const AuthGuard: CustomFC = ({ children }) => {
    const user = useSelector(state => state.userReducer);

    return <>
        {isFunction(children) ? children(!!user) : children}
    </>
}