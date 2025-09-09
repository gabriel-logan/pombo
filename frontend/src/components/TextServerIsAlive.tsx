import { useEffect, useState } from "react";
import { Text } from "react-native";

import socket from "../lib/socketInstance";
import colors from "../utils/colors";

export default function TextServerIsAlive() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  useEffect(() => {
    socket.emit("check-alive", (data: { status: boolean }) => {
      setServerIsAlive(data.status);
    });

    const interval = setInterval(() => {
      socket.emit("check-alive", (data: { status: boolean }) => {
        setServerIsAlive(data.status);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  return (
    <Text
      style={{
        color: serverIsAlive
          ? colors.light.statusSuccess
          : colors.light.statusError,
        position: "absolute",
        top: 10,
        right: 10,
      }}
    >
      Server is {serverIsAlive ? "alive" : "down"}
    </Text>
  );
}
