import { createDrawerNavigator } from "@react-navigation/drawer";

import ProfilePage from "../pages/Profile";
import SettingsPage from "../pages/Settings";
import type { RootDrawerParamList } from "../types/Navigation";
import ChatNativeStackNavigator from "./ChatNativeStack";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function RootDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="ChatNativeStackNavigator">
      <Drawer.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="ChatNativeStackNavigator"
        component={ChatNativeStackNavigator}
        options={{ title: "Main" }}
      />
      <Drawer.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{ title: "Settings" }}
      />
    </Drawer.Navigator>
  );
}
