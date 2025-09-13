import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextSocketIsAlive from "./src/components/TextSocketIsAlive";
import { getSocket } from "./src/lib/socketInstance";
import RootNativeStackNavigator from "./src/router/RootNativeStack";
import { useAuthStore } from "./src/stores/authStore";
import { useUserStore } from "./src/stores/userStore";
import colors from "./src/utils/colors";

export default function App() {
  const { socketIsAlive, setSocketIsAlive } = useUserStore((state) => state);

  const restoreSession = useAuthStore((state) => state.restoreSession);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function checkServerAlive() {
      setIsLoading(true);

      const socket = getSocket();

      if (!socket) return;

      socket.emit("check-alive", (data: { status: boolean }) => {
        setSocketIsAlive((prev) => (prev !== data.status ? data.status : prev));
      });

      if (socket.disconnected) {
        setSocketIsAlive(false);
      }

      setIsLoading(false);
    }

    checkServerAlive();
    const interval = setInterval(checkServerAlive, 5000);

    return () => clearInterval(interval);
  }, [setIsLoading, setSocketIsAlive]);

  useEffect(() => {
    restoreSession().finally(() => setIsLoading(false));
  }, [restoreSession]);

  if (isLoading || !socketIsAlive) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text
          style={{
            marginTop: 26,
            color: colors.light.textMain,
          }}
        >
          Please wait... Server is down. Trying to reconnect.
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNativeStackNavigator />
      <TextSocketIsAlive />
    </NavigationContainer>
  );
}
