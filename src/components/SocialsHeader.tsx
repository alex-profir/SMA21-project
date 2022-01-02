import React from "react";
import { View } from "react-native";
import { HeaderTitleProps } from "@react-navigation/elements"
import { Text } from "react-native-elements"
import { width } from "../styles";
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
export const SocialsHeader = (p: HeaderTitleProps) => {
    const nav = useNavigation<any>();
    return <View style={{
        // backgroundColor: "blue",
        display: "flex",
        flexDirection: 'row',
        // flex: 1
        width: width - 30
    }}>
        <Text h4>
            {p.children} Test
        </Text>
        <View style={{ flex: 1 }} />
        <FontAwesome.Button onPress={() => {
            console.log("Search");
            nav.navigate("Socials", {
                screen: "UserSearch"
            })
        }} style={{
            backgroundColor: "white"
        }} name="search" size={24} color="black" />
    </View>
}