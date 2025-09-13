import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextSocketIsAlive from "./src/components/TextSocketIsAlive";
import { useServerHealth } from "./src/hooks/useServerHealth";
import RootNativeStackNavigator from "./src/router/RootNativeStack";
import { useAuthStore } from "./src/stores/authStore";
import { useUserStore } from "./src/stores/userStore";
import colors from "./src/utils/colors";

export default function App() {
  const { serverIsAlive } = useUserStore();

  const restoreSession = useAuthStore((s) => s.restoreSession);

  const [restoring, setRestoring] = useState(true);

  const { isChecking } = useServerHealth();

  useEffect(() => {
    restoreSession().finally(() => setRestoring(false));
  }, [restoreSession]);

  if (restoring || isChecking || !serverIsAlive) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text style={{ marginTop: 26, color: colors.light.textMain }}>
          {(() => {
            if (restoring) {
              return "Restoring session...";
            } else if (!serverIsAlive) {
              return "Server is down. Trying to reconnect...";
            } else {
              return "Checking server...";
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
