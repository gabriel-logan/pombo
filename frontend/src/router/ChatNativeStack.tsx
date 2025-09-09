import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ChatPage from "../pages/Chat";
import MainPage from "../pages/Main";

const Stack = createNativeStackNavigator();

export default function ChatNativeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainPage} />
      <Stack.Screen name="Chat" component={ChatPage} />
    </Stack.Navigator>
  );
}
