import React from "react";
import { NavigationProp, useNavigation as RNUserNavigation } from "@react-navigation/native";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";

export const auth = {
    login: {
        component: Login,
    },
};

export const dashboard = {
    dashboard: {
        component: Dashboard
    }
}

export const dashboardRoutes = [dashboard];
export const authRoutes = [auth];
const allRoutes = {
    ...auth,
    ...dashboard
}

export type RouteType =  {
    [name: string]: {
        component: React.FunctionComponent<any>// | React.ComponentClass<any>
    },
}
type RouteTypes<T extends RouteType> = {
    [P in keyof T]: Parameters<T[P]["component"]>[0] extends undefined ? any : Parameters<T[P]["component"]>[0]
}

type Routes = RouteTypes<Omit<typeof allRoutes, "guard">>
export const useNavigation = () => RNUserNavigation<NavigationProp<ReactNavigation.RootParamList & Routes>>();


