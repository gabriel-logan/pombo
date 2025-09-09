import { useEffect, useState } from "react";
import { Text } from "react-native";

import socket from "../lib/socketInstance";
import colors from "../utils/colors";

export default function TextServerIsAlive() {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  useEffect(() => {
    function checkServerAlive() {
      socket.emit("check-alive", (data: { status: boolean }) => {
        setServerIsAlive((prev) => (prev !== data.status ? data.status : prev));
      });

      if (socket.disconnected) {
        setServerIsAlive(false);
      }
    }

    checkServerAlive();
    const interval = setInterval(checkServerAlive, 5000);

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
