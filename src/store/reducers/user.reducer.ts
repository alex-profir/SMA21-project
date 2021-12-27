import { ActionsOf, init } from "../utils";
import { ServerErrorValue } from "../../models/ServerError";
import { FullUser } from "../../models/User";
import * as actions from "../actions/user.actions"

export type UserActions = typeof actions

export function userReducer(
    state = init<FullUser & { error?: ServerErrorValue }>(null as any),
    action: ActionsOf<UserActions>
): typeof state {
    switch (action.type) {
        case "USER_LOGIN":
            return {
                ...state,
                ...action.user,
            };
        case "USER_REGISTER": {
            return action.user;
        }
        case "SET_USER": {
            return action.user;
        }
        case "USER_LOGIN_ERROR":
            return {
                ...state,
                error: action.error
            };
        case "SET_USER_PROFILE": {
            return {
                ...state,
                avatar: action.avatar
            }
        }
        case "USER_LOGOUT": {
            return null!;
        }
        default:
            return state;
    }
}