import { StyleSheet, Text, View } from "react-native";

import colors from "../utils/colors";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: colors.light.backgroundApp,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
