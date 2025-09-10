import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";
import colors from "../utils/colors";

export default function ProfilePage() {
  const { signOut, user } = useAuthStore((state) => state);

  const navigation = useNavigation();

  async function handleLogout() {
    await signOut();

    navigation.reset({
      index: 0,
      routes: [{ name: "AuthPage" }],
    });
  }

  function openGithub() {
    if (user?.url) {
      Linking.openURL(user.url);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
      <Text style={styles.name}>{user?.username}</Text>
      <Text style={styles.followers}>
        Followers: {user?.followers.quantity}
      </Text>
      <Text style={styles.followings}>
        Following: {user?.following.quantity}
      </Text>
      <Text style={styles.github} onPress={openGithub}>
        {user?.url}
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: colors.light.backgroundApp,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.light.borderLight,
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.light.textMain,
  },

  followers: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 10,
  },

  followings: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  github: {
    fontSize: 16,
    color: colors.light.link,
    textDecorationLine: "underline",
    marginBottom: 30,
  },

  logoutButton: {
    backgroundColor: colors.light.btnLogoutBackground,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  logoutText: {
    color: colors.light.btnLogoutText,
    fontWeight: "bold",
    fontSize: 16,
  },
});
