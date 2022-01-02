import React, { useState } from "react";
import { View, Text } from "react-native";
import { Avatar, Button, ListItem } from "react-native-elements";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { FullUser } from "../../models/User";
import { useNavigation } from "../../routes";
import { endpointURL } from "../../services/config";
import { acceptFriendRequest, getUserById, rejectFriendRequest } from "../../services/user.service";
export const RenderUserRequest = ({ userId }: { userId: string }) => {
    const [user, setUser] = useState<FullUser | null>(null);
    const nav = useNavigation();
    useEffectAsync(async () => {
        const response = await getUserById(userId);
        setUser(response.data);
    }, []);

    return <ListItem style={{
        // display: "flex",
        // flexDirection: "column",
        // backgroundColor: "blue",
    }}>
        <Avatar onPress={() => {
            nav.navigate("Socials" as any, {
                screen: "ProfileView",
                params: {
                    userId: user?._id
                }
            })
        }} rounded source={{ uri: `${endpointURL}/file/${user?.avatar}` }} />
        <Text>
            {user?.first_name} {user?.last_name}
        </Text>
        <Button title={"Accept"} onPress={async () => {
            await acceptFriendRequest(userId);
        }} />
        <Button title={"Decline"} onPress={async () => {
            await rejectFriendRequest(userId);
        }} />
    </ListItem>
}