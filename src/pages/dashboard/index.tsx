import React, { useMemo, useState } from "react";
import { View, Image } from "react-native"
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { endpointURL } from "../../services/config";
import { useSelector } from "../../store";
import { getAverageRGB, getImageOrFallback } from "../../utils/utilFunctions";
import ImageColors from 'react-native-image-colors'
import { getRgb } from "../../services/file.service";
import { useEffectAsync } from "../../hooks/useEffectAsync";
import { Tab as ReTab, TabView, Text } from "react-native-elements";
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Profile } from "../profile/Profile";
import { Messenger } from "../messenger";


const NaviagtionPart = () => {

    const [index, setIndex] = useState(0);
    return <>
        <ReTab
            value={index}
            onChange={(e) => setIndex(e)}
            indicatorStyle={{
                backgroundColor: 'white',
                height: 3,
            }}
            variant="primary"
        >
            <ReTab.Item
                title="Dashboard"
                titleStyle={{ fontSize: 12 }}
                icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
            />
            <ReTab.Item
                title="Profile"
                titleStyle={{ fontSize: 12 }}
                icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
            />
            <ReTab.Item
                title="Messenger"
                titleStyle={{ fontSize: 12 }}
                icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
            />
        </ReTab>

        <TabView value={index} onChange={setIndex} animationType="spring">
            <TabView.Item style={{ backgroundColor: 'red', width: '100%' }}>
                <Text h1>Recent</Text>
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
                <Text h1>Favorite</Text>
            </TabView.Item>
            <TabView.Item style={{ backgroundColor: 'green', width: '100%' }}>
                <Text h1>Cart</Text>
            </TabView.Item>
        </TabView>
    </>
}
function HomeScreen() {
    return <View>
        <Text>
            Home Screen
        </Text>
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
    "MyProfile": {
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
                <Tab.Screen name="Dashboard" component={HomeScreen} />
                {/* MyProfile */}
                <Tab.Screen name="Messenger" component={Messenger} />
                <Tab.Screen name="MyProfile"  >
                    {props => <Profile {...props} />}
                </Tab.Screen>
            </Tab.Navigator>
        </NavigationContainer>
        {/* <NaviagtionPart /> */}

    </View >
}
export default Dashboard;

