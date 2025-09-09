import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextServerIsAlive from "./src/components/TextServerIsAlive";
import RootNativeStackNavigator from "./src/router/RootNativeStack";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootNativeStackNavigator />
      <TextServerIsAlive />
    </NavigationContainer>
  );
}
