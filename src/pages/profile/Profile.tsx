import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-elements";
import { Avatar, } from "react-native-elements";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { endpointURL } from "../../services/config";
import { getRgb } from "../../services/file.service";
import { useSelector } from "../../store";
import { width } from "../../styles";
import * as DocumentPicker from 'expo-document-picker';
import { ParamListBase, RouteProp } from "@react-navigation/native";

type NavigationComponent = {
    route: RouteProp<ParamListBase, any>;
    navigation: any;
}
const BorderRadius = 40;
export const Profile = ({ }: NavigationComponent) => {
    const user = useSelector(state => state.userReducer);
    const [rgb, setRgb] = useState<{ r: number, g: number, b: number } | null>(null);

    useEffectAsync(async () => {
        try {
            const request = await getRgb(`${endpointURL}/file/${user.avatar}`);
            const data = request.data;
            setRgb({
                r: data.Vibrant.rgb[0],
                g: data.Vibrant.rgb[1],
                b: data.Vibrant.rgb[2],
            });

        } catch (e) {
            // console.log("Could not pick color from image");
            // console.log({ e });
            return null;
        }
    }, [user]);
    return <View style={{
        display: "flex",
        flex: 1,
        backgroundColor: "white"
    }}>
        <View style={{
            height: 150,
            backgroundColor: rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},1)` : "gray",
            width: width,
            borderBottomLeftRadius: BorderRadius,
            borderBottomRightRadius: BorderRadius,
            marginBottom: 100,
        }} />
        <View style={{
            position: "absolute",
            top: 100,
            left: width / 2 - 50,

            borderRadius: BorderRadius,
            borderColor: "white",
            borderWidth: 5
        }}>
            <Avatar
                size={"large"}
                rounded
                source={{ uri: `${endpointURL}/file/${user.avatar}`, height: 100, width: 100 }}
                onPress={async () => {
                    const doc = await DocumentPicker.getDocumentAsync({
                        // multiple: false,
                        type: "image/*"
                    });
                    if (doc.type === "success") {
                        console.log("success");
                        console.log(doc.file);
                        console.log({ doc });
                    } else {

                        console.log("cancel");
                    }
                }}
            >
                {/* <Avatar.Accessory tvParallaxProperties size={23} /> */}
            </Avatar>
        </View>
        <View>
            <Button title="Upload Profile Picture" onPress={() => { }} />
        </View>

    </View >
}