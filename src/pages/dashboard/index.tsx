import React, { useMemo, useState } from "react";
import { View, Text, Image } from "react-native"
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { endpointURL } from "../../services/config";
import { useSelector } from "../../store";
import { getAverageRGB, getImageOrFallback } from "../../utils/utilFunctions";
import ImageColors from 'react-native-image-colors'
import { getRgb } from "../../services/file.service";
import { useEffectAsync } from "../../hooks/useEffectAsync";


const Dashboard = () => {
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
        padding: 40
    }}>
        <Text>
            Wohoo, you're on the dashboard
        </Text>
        <View style={{
            backgroundColor: rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},1)` : "blue"
        }}>
            <Image

                source={{ height: 100, width: 100, uri: `${endpointURL}/file/${user.avatar}` }}
                onLoad={(ev) => {
                    try {
                        // console.log({ ev });
                        console.log("LOADED");
                        const rgb = getAverageRGB(ev as any);
                        console.log({ rgb });
                    }
                    catch (e) {
                        console.log("Nope");
                        console.log({ e });
                    }
                }}
            >

            </Image>
            <Avatar
                size={"large"}
                rounded
                source={{ uri: `${endpointURL}/file/${user.avatar}`, height: 100, width: 100 }}
                imageProps={{
                    onLoad: (ev) => {
                        console.log("LOADED");

                        // getAverageRGB()
                    }
                }}
            />
        </View>
    </View >
}
export default Dashboard;