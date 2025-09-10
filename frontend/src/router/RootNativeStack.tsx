import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthPage from "../pages/Auth";
import ChatPage from "../pages/Chat";
import { RootNativeStackParamList } from "../types/Navigation";
import RootDrawerNavigator from "./RootDrawer";

const Stack = createNativeStackNavigator<RootNativeStackParamList>();

export default function RootNativeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="AuthPage"
        component={AuthPage}
        options={{ title: "Authentication" }}
      />
      <Stack.Screen
        name="RootDrawerNavigator"
        component={RootDrawerNavigator}
        options={{ title: "Main" }}
      />
      <Stack.Screen
        name="ChatPage"
        component={ChatPage}
        options={{ title: "Chat" }}
      />
    </Stack.Navigator>
  );
}
