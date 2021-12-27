export interface BaseUser {
    email: string;
}
export type UserContextType = BaseUser | null

export type User = BaseUser & {
    password: string;
    first_name: string;
    last_name: string;
    friends: string[];
    chatRooms: string[];
    friendRequests: string[];
}

export type FullUser = User & {
    _id: string;
    updatedAt: string;
    createdAt: string;
    avatar?: string;
}