import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatPage from "../pages/Chat";
import MainPage from "../pages/Main";
import type { ChatNativeStackParamList } from "../types/Navigation";

const Stack = createNativeStackNavigator<ChatNativeStackParamList>();

export default function ChatNativeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MainPage"
        component={MainPage}
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
