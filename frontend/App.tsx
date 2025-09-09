import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

export default function App() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  socket.emit("check-alive", (data: { status: boolean }) => {
    setServerIsAlive(data.status);
  });

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Text>Server is {serverIsAlive ? "alive" : "down"}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
