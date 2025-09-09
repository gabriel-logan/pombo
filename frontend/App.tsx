import { useState } from "react";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import socket from "./src/lib/socketInstance";
import RootDrawerNavigator from "./src/router/RootDrawer";

export default function App() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  socket.emit("check-alive", (data: { status: boolean }) => {
    setServerIsAlive(data.status);
  });

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootDrawerNavigator />
      <Text
        style={{
          color: serverIsAlive ? "green" : "red",
          position: "absolute",
          top: 10,
          right: 10,
        }}
      >
        Server is {serverIsAlive ? "alive" : "down"}
      </Text>
    </NavigationContainer>
  );
}
