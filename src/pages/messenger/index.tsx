import React, { } from "react";
import { View } from "react-native";
import { Stack } from "../../routes/Routes";
import { FriendList } from "./FriendList";
import { PersonView } from "./PersonView";

export const Messenger = () => {
    return <View style={{
        display: "flex",
        flex: 1,
    }}>
        <Stack.Navigator >
            <Stack.Screen options={{
                // headerShown: false,
                headerTitle: "Friend List",
            }} name="PersonList" component={FriendList} />
            <Stack.Screen options={{
                headerSearchBarOptions: {

                }
            }} name="PersonView" component={PersonView} />
        </Stack.Navigator>
    </View>
}