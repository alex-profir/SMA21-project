import React from "react";
import { Text } from "react-native";
import { Avatar, Button, ListItem } from "react-native-elements";
import { FullUser } from "../../models/User";
import { useNavigation } from "../../routes";
import { endpointURL } from "../../services/config";

export const UserListRender = ({ user }: { user: FullUser }) => {
    const nav = useNavigation();
    return <ListItem onPress={() => {
        nav.navigate("Socials" as any, {
            screen: "ProfileView",
            params: {
                userId: user?._id
            }
        })
    }}>
        <Avatar rounded source={{ uri: `${endpointURL}/file/${user?.avatar}` }} />
        <Text>
            {user?.first_name} {user?.last_name}
        </Text>
        {/* <Button title={"Accept"} onPress={async () => {
            await acceptFriendRequest(userId);
        }} />
        <Button title={"Decline"} onPress={async () => {
            await rejectFriendRequest(userId);
        }} /> */}
    </ListItem>
}
