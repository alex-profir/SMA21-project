import { combineReducers } from "redux";
import { ActionsFromMap, StateFromMap } from "../utils";
import { userReducer } from "./user.reducer"
const reducers = {
    userReducer
}

export type AppState = StateFromMap<typeof reducers>
// export interface AppState extends StateFromMap<typeof reducers> {}

export type AppActions = ActionsFromMap<typeof reducers>


export const appReducer = combineReducers<AppState, AppActions>(reducers as any);
