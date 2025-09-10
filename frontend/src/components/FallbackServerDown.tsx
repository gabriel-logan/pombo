import { StyleSheet, Text, View } from "react-native";

import colors from "../utils/colors";

export default function FallbackServerDown() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Server is down</Text>
      <Text style={styles.subtext}>Please try again later.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    fontSize: 16,
    color: colors.light.textMain,
  },

  subtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
});
