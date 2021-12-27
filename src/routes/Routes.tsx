import React, { Fragment } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { authRoutes, dashboardRoutes, RouteType } from ".";
import { useEffectAsync } from "../hooks/useEffectAsync";
import { retrieveStorageToken } from "../utils/utilFunctions";
import useInitialize from "../hooks/useInitialize";
import { View, Text } from "react-native";
import { useSelector } from "../store";
import { AuthGuard } from "../components/Guards/AuthGuard";
import { Loader } from "../pages/Loading";

export const Stack = createNativeStackNavigator();

function createStacks(r: RouteType[]) {

    return <Stack.Navigator>
        {r.map((Route, i) => {
            const { guard, ...routes } = Route;
            const Routes = Object.entries(routes).map(([name, { component }]) => {
                return <Stack.Screen key={name} name={name} component={component} options={{
                    // statusBarHidden: true
                    headerShown: false,
                    headerLargeTitleShadowVisible: false,
                }} />
            });
            return <Fragment key={i}>
                {Routes}
            </Fragment>
        })}
    </Stack.Navigator>
}
export default function () {
    const { checked } = useInitialize();

    if (!checked) {
        return <Loader />;
    }
    return <>
        <AuthGuard>
            {(isLoggedIn) => isLoggedIn
                ? createStacks(dashboardRoutes) :
                createStacks(authRoutes)
            }
        </AuthGuard>
    </>
}