import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Text } from "react-native";

import Main from "./src/Main";

import socket from "./src/lib/socketInstance";

export default function App() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  socket.emit("check-alive", (data: { status: boolean }) => {
    setServerIsAlive(data.status);
  });

  return (
    <>
      <Text>Server is {serverIsAlive ? "alive" : "down"}</Text>
      <StatusBar style="auto" />
      <Main />
    </>
  );
}
