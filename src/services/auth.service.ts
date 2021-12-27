import { FullUser, User } from "../models/User";
import axios from "../utils/axios";
import { headers } from "./config";

export const login = async (user: { email: string, password: string }) => {
    return axios.post<{
        user: FullUser,
        token: string;
    }>("/auth/login", user);
}
export const register = (user: User) => {
    return axios.post<{
        user: FullUser
    }>("/auth/register", user);
}

export const forgotPassword = () => {
    throw new Error("Not implemented yet");
}

export const getCurrentUser = () => {
    return axios.get<FullUser>("/auth/current-user", { headers });
}