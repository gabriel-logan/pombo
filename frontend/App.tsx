import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextServerIsAlive from "./src/components/TextServerIsAlive";
import RootNativeStackNavigator from "./src/router/RootNativeStack";
import { useAuthStore } from "./src/stores/authStore";
import colors from "./src/utils/colors";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession().finally(() => setIsLoading(false));
  }, [restoreSession]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text
          style={{
            marginTop: 26,
            color: colors.light.textMain,
          }}
        >
          Please wait... Server is starting
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNativeStackNavigator />
      <TextServerIsAlive setIsLoading={setIsLoading} />
    </NavigationContainer>
  );
}
