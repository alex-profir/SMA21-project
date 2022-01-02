import React, { Fragment } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { authRoutes, dashboardRoutes, RouteType } from ".";
import useInitialize from "../hooks/useInitialize";
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