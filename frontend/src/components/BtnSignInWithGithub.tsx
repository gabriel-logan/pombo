import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import colors from "../utils/colors";

interface BtnSignInWithGithubProps {
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  testID?: string;
  key?: string;
}

export default function BtnSignInWithGithub({
  onPress,
  disabled,
  testID,
  key,
}: Readonly<BtnSignInWithGithubProps>) {
  return (
    <TouchableOpacity
      style={styles.githubButton}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      key={key}
      accessibilityRole="button"
    >
      <FontAwesome6 name="github" style={styles.githubButtonText} />
      <Text style={styles.githubButtonText}>Sign in with GitHub</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  githubButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.light.btnGithubBackground,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  githubButtonText: {
    color: colors.light.btnGithubText,
    fontSize: 20,
    fontWeight: "600",
  },
});
