import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextSocketIsAlive from "./src/components/TextSocketIsAlive";
import { useServerHealth } from "./src/hooks/useServerHealth";
import { useSocketHealth } from "./src/hooks/useSocketHealth";
import RootNativeStackNavigator from "./src/router/RootNativeStack";
import { useAuthStore } from "./src/stores/authStore";
import { useUserStore } from "./src/stores/userStore";
import colors from "./src/utils/colors";

export default function App() {
  const { serverIsAlive } = useUserStore();
  const restoreSession = useAuthStore((s) => s.restoreSession);

  const [restoring, setRestoring] = useState(true);

  const { isChecking: checkingServer } = useServerHealth(10000);
  useSocketHealth();

  useEffect(() => {
    restoreSession().finally(() => setRestoring(false));
  }, [restoreSession]);

  if (restoring || (!serverIsAlive && checkingServer)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text style={{ marginTop: 26, color: colors.light.textMain }}>
          {(() => {
            if (restoring) {
              return "Restoring session...";
            } else {
              return "Server is down. Trying to reconnect... Please wait.";
            }
          })()}
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
