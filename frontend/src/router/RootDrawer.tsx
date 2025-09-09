import { createDrawerNavigator } from "@react-navigation/drawer";

import ChatNativeStackNavigator from "./ChatNativeStack";

const Drawer = createDrawerNavigator();

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
