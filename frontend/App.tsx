import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text } from "react-native";

import socket from "./src/lib/socketInstance";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigator from "./src/router/Drawer";

export default function App() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  socket.emit("check-alive", (data: { status: boolean }) => {
    setServerIsAlive(data.status);
  });

  return (
    <NavigationContainer>
      <Text>Server is {serverIsAlive ? "alive" : "down"}</Text>
      <StatusBar style="auto" />
      <DrawerNavigator />
    </NavigationContainer>
  );
}
