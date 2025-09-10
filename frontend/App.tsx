import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import Loading from "./src/components/Loading";
import TextServerIsAlive from "./src/components/TextServerIsAlive";
import RootNativeStackNavigator from "./src/router/RootNativeStack";
import { useAuthStore } from "./src/stores/authStore";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    useAuthStore.restoreSession().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNativeStackNavigator />
      <TextServerIsAlive />
    </NavigationContainer>
  );
}
