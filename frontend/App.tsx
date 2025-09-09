import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";

import TextServerIsAlive from "./src/components/TextServerIsAlive";
import RootDrawerNavigator from "./src/router/RootDrawer";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <RootDrawerNavigator />
      <TextServerIsAlive />
    </NavigationContainer>
  );
}
