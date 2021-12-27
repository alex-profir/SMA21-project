import { createStore, applyMiddleware, } from "redux";
import reduxThunk, { ThunkDispatch } from "redux-thunk";
import {
    useSelector as reduxUseSelector,
    useDispatch as reduxUseDispatch
} from "react-redux";
import { AppActions, appReducer, AppState } from "./reducers";

export const useSelector = <TSelector>(selector: (state: AppState) => TSelector) => reduxUseSelector(selector);
export const useDispatch = () => reduxUseDispatch<typeof store["dispatch"]>() as ThunkDispatch<AppState, void, AppActions>;

export const store = createStore(
    appReducer,
);