import React, { useRef, useState } from "react";
import { View } from "react-native"
import { endpointURL } from "../../services/config";
import { useSelector } from "../../store";
import { getRgb } from "../../services/file.service";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { Button, FAB, Text } from "react-native-elements";
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';
import * as Svg from 'react-native-svg';
import * as d3Shape from 'd3-shape';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Messenger } from "../messenger";
import { Socials } from "../profile/Socials";
import { SocialsHeader } from "../../components/SocialsHeader";
import { px, width } from "../../styles";
import { Renderer } from "../../components/WheelComponent";
import Wheel from "../../components/Wheel";

function HomeScreen() {
    const user = useSelector(state => state.userReducer);
    return <View style={{
        paddingTop: 50,
        // paddingLeft: 10,
        display: "flex",
        alignItems: "center"
    }}>
        <Wheel user={user} />
    </View>
}

const IconsMap = {
    "Dashboard": {
        normal: "ios-information-circle-outline",
        focused: "ios-information-circle",
        component: Ionicons,
    },
    "Messenger": {
        normal: "message-circle",
        focused: "message-circle",
        component: Feather
    },
    "Socials": {
        normal: "ios-person-circle-outline",
        focused: "ios-person-circle",
        component: Ionicons,
    }
}
const Tab = createBottomTabNavigator();
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
        // padding: 40
        display: "flex",
        flex: 1,
        // paddingTop: 40,
    }}>
        {/* <Text>
            Wohoo, you're on the dashboard
        </Text>
        <View style={{
            backgroundColor: rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},1)` : "blue"
        }}>
            <Avatar
                size={"large"}
                rounded
                source={{ uri: `${endpointURL}/file/${user.avatar}`, height: 100, width: 100 }}
            />
        </View> */}

        <NavigationContainer independent={true} >
            <Tab.Navigator

                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        const CurrentMap = (IconsMap)[route.name as keyof typeof IconsMap];
                        const Component = CurrentMap.component;
                        return <Component size={size} color={color} name={focused ? CurrentMap.focused : CurrentMap.normal as any} />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                    // tabBarLabelPosition:"beside-icon",
                })}
            >
                <Tab.Screen name="Dashboard" component={HomeScreen}
                />
                {/* MyProfile */}
                <Tab.Screen name="Messenger" component={Messenger}
                    options={{
                        unmountOnBlur: true
                    }}
                    listeners={({ navigation }) => ({
                        tabPress: e => {
                            e.preventDefault();

                            navigation.navigate("Messenger", {
                                screen: "PersonList"
                            })
                        }
                    })} />
                <Tab.Screen listeners={({ navigation }) => ({
                    tabPress: e => {
                        e.preventDefault();

                        navigation.navigate("Socials", {
                            screen: "SocialsView"
                        })
                    }
                })} name="Socials" options={{
                    tabBarBadge: user.friendRequests.length || undefined,
                }}>
                    {Socials}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
        {/* <NaviagtionPart /> */}

    </View >
}
export default Dashboard;

