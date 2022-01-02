import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Button } from "react-native-elements";
import { SocialsHeader } from "../../components/SocialsHeader";
import { UserSearchHeader } from "../../components/UserSearchHeader";
import { SearchBoxContext } from "../../contexts/SearchBoxContext";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { FullUser } from "../../models/User";
import { Root } from "../../routes";
import { Stack } from "../../routes/Routes";
import { searchUsers } from "../../services/user.service";
import { useSelector } from "../../store";
import { width } from "../../styles";
import { Loader } from "../Loading";
import { Profile } from "./Profile";
import { RenderUserRequest } from "./UserFriendRequest";
import { UserListRender } from "./UserListRender";


const SocialsView = (p: NativeStackScreenProps<Root, "PersonView">) => {
    const { navigation } = p;
    const user = useSelector(state => state.userReducer);
    return <View>
        <Button title="My Profile" onPress={() => {
            navigation.navigate("ProfileView", {
                userId: user._id
            })
        }} />
        <FlatList<string>
            data={user.friendRequests}
            keyExtractor={(_, index: number) => index.toString()}

            renderItem={props => <RenderUserRequest userId={props.item} />}
        />
        <View style={{
            display: "flex",
            alignItems: "center",
            top: width / 2,
            // flex: 1
        }}>
            <Text style={{
                fontSize: 26,
                fontWeight: "bold"
            }}>
                You have <Text style={{ color: "green" }}>{user.balance}</Text> credits
            </Text>
        </View>
    </View>
}
const UserSearch = () => {

    const [textInput, setTextInput] = useContext(SearchBoxContext);
    const [users, setUsers] = useState<FullUser[]>([]);
    const [loading, setLoading] = useState(false);
    const { } = useEffectAsync(async () => {
        setLoading(true);
        const users = await searchUsers({
            limit: 999, offset: 0, search: textInput
        })
        setUsers(users.data.results);
        setLoading(false);
    }, [textInput]);
    // UserListRender
    if (loading) {
        return <Loader />;
    }

    return <FlatList<FullUser>
        data={users}
        keyExtractor={(_, index: number) => index.toString()}

        renderItem={props => <UserListRender user={props.item} />}
    />
}

export const Socials = () => {
    return <View style={{
        flex: 1,
        display: "flex"
    }}>
        <Stack.Navigator screenOptions={{
            animation: "slide_from_right",
            gestureEnabled: true
        }}>
            <Stack.Screen name="SocialsView" options={{
                headerTitle: (props) => <SocialsHeader {...props} />
            }} component={SocialsView} />
            <Stack.Screen name="ProfileView" component={Profile} />

            <Stack.Screen name="UserSearch" component={UserSearch} options={{
                headerTitle: UserSearchHeader
            }} />
        </Stack.Navigator>
    </View>
}