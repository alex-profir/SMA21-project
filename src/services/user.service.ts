import { BasicQuerySearch, QueryResult } from "../models/API";
import { FullUser } from "../models/User";
import axios from "../utils/axios";
import { headers } from "./config";

export const postProfilePicture = (file: File) => {
    const data = new FormData();
    data.append("file", file);
    return axios.post<{
        url: string;
        filename: string;
    }>("/user/upload-pfp", data, { headers });
}
export const getUserById = (userId: string) => {
    return axios.get<FullUser>(`/user/${userId}`, { headers });
}

export const sendFriendRequest = (userId: string) => {
    return axios.post<any>(`/user/send-friend-request`, {
        id: userId
    }, { headers });
}


export const acceptFriendRequest = (userId: string) => {
    return axios.post<any>(`/user/accept-friend-request`, {
        id: userId
    }, { headers });
}
export const rejectFriendRequest = (userId: string) => {
    return axios.post<any>(`/user/reject-friend-request`, {
        id: userId
    }, { headers });
}
export const unfriend = (userId: string) => {
    return axios.post<any>(`/user/unfriend`, {
        id: userId
    }, { headers });
}

export const searchUsers = (query: BasicQuerySearch) => {
    return axios.get<QueryResult<FullUser>>(`/user/search/`, {
        params: query
    })
}
export const searchUsersInIds = (ids: string[]) => {
    return axios.post<FullUser[]>(`/user/search-ids`, { ids }, { headers })
}