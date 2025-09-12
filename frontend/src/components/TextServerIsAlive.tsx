import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Octicons } from "@expo/vector-icons";

import { getSocket } from "../lib/socketInstance";
import colors from "../utils/colors";

interface TextServerIsAliveProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function TextServerIsAlive({
  setIsLoading,
}: Readonly<TextServerIsAliveProps>) {
  const [serverIsAlive, setServerIsAlive] = useState(false);

  useEffect(() => {
    function checkServerAlive() {
      setIsLoading(true);

      const socket = getSocket();

      if (!socket) return;

      socket.emit("check-alive", (data: { status: boolean }) => {
        setServerIsAlive((prev) => (prev !== data.status ? data.status : prev));
      });

      if (socket.disconnected) {
        setServerIsAlive(false);
      } else {
        setIsLoading(false);
      }
    }

    checkServerAlive();
    const interval = setInterval(checkServerAlive, 5000);

    return () => clearInterval(interval);
  }, [setIsLoading]);
  return (
    <View style={styles.container}>
      <Octicons
        name="dot-fill"
        size={26}
        color={
          serverIsAlive ? colors.light.statusSuccess : colors.light.statusError
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 6,
    right: 10,
  },
});
