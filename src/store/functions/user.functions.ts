import { UserActions } from "../reducers/user.reducer";
import { createDispatcher } from "../utils";
import { ServerError } from "../../models/ServerError";
import { User } from "../../models/User";
import { login as UserLogin, register as UserRegister } from "../../services/auth.service"
import { isAxiosError, removeTokenFromLocalStorage } from "../../utils/utilFunctions";
import { postProfilePicture } from "../../services/user.service";

/**
 * 
 * @warning this method has internal error handling
 */
export const login = (user: User) => {
    return createDispatcher<UserActions>(async dispatch => {
        try {
            const req = await UserLogin(user);
            dispatch({
                type: "USER_LOGIN",
                user: req.data.user
            });
        } catch (error: any) {
            dispatch({
                type: "USER_LOGIN_ERROR",
                error
            });
        }
    })
}
/**
 * 
 * @warning this method has internal error handling
 */
export const register = (user: User) => {
    return createDispatcher<UserActions>(async dispatch => {
        try {
            const req = await UserRegister(user);
            dispatch({
                type: "USER_REGISTER",
                user: req.data.user
            });
        } catch (error) {
            if (isAxiosError<ServerError>(error)) {
                const message = error.response!.data.message;
                dispatch({
                    type: "USER_LOGIN_ERROR",
                    error: message
                });
            }
        }
    })
}

export const logoutAction = () => {
    return createDispatcher<UserActions>(async dispatch => {
        removeTokenFromLocalStorage()
        dispatch({
            type: "USER_LOGOUT"
        })
    })
}

export const uploadUserProfilePicture = (file: File) => {
    return createDispatcher<UserActions>(async dispatch => {
        const request = (await postProfilePicture(file)).data
        dispatch({
            type: "SET_USER_PROFILE",
            avatar: request.filename
        })
    })
}