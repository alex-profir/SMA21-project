import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export const Loader = () => {
    return <View style={{
        // backgroundColor: "green",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
}