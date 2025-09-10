import { createDrawerNavigator } from "@react-navigation/drawer";

import MainPage from "../pages/Main";
import ProfilePage from "../pages/Profile";
import SettingsPage from "../pages/Settings";
import type { RootDrawerParamList } from "../types/Navigation";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function RootDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="MainPage">
      <Drawer.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ title: "Profile" }}
      />
      <Drawer.Screen
        name="MainPage"
        component={MainPage}
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
