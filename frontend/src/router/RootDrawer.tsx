import { createDrawerNavigator } from "@react-navigation/drawer";

import type { RootDrawerParamList } from "../types/Navigation";
import ChatNativeStackNavigator from "./ChatNativeStack";

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function RootDrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="ChatNativeStackNavigator"
        component={ChatNativeStackNavigator}
        options={{ title: "Main" }}
      />
    </Drawer.Navigator>
  );
}
