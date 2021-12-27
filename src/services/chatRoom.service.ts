import axios from "../utils/axios";
import { headers } from "./config";


export const searchRoomsInIds = (ids: string[]) => {
    return axios.post<any[]>(`/rooms/search-ids`, { ids }, { headers })
}
/**
 * 
 * @param members Array of ids
 * @returns 
 */
export const searchRoomsInMembers = (members: string[]) => {
    return axios.post<any[]>(`/rooms/search-members`, { ids: members }, { headers })
}