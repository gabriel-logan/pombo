import { createDrawerNavigator } from "@react-navigation/drawer";

import ChatPage from "../pages/Chat";
import MainPage from "../pages/Main";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Main" component={MainPage} />
      <Drawer.Screen name="Chat" component={ChatPage} />
    </Drawer.Navigator>
  );
}
