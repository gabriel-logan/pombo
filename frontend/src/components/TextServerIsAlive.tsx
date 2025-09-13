import { StyleSheet, View } from "react-native";
import { Octicons } from "@expo/vector-icons";

import { useUserStore } from "../stores/userStore";
import colors from "../utils/colors";

export default function TextServerIsAlive() {
  const { serverIsAlive } = useUserStore((state) => state);

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
    top: 4,
    right: 8,
  },
});
