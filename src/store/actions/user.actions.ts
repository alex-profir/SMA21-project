import { ServerErrorValue } from "../../models/ServerError";
import { FullUser, User } from "../../models/User"
import { a } from "../utils"

export const login = (user: User) => a({ type: "USER_LOGIN", user })
export const register = (user: FullUser) => a({ type: "USER_REGISTER", user })
export const error = (error: ServerErrorValue) => a({ type: "USER_LOGIN_ERROR", error });
export const setUser = (user: FullUser) => a({ type: "SET_USER", user });
export const logout = () => a({ type: "USER_LOGOUT" });

export const uploadProfilePicture = (avatar: string) => a({ type: "SET_USER_PROFILE", avatar })