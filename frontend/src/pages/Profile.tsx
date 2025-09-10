import { useEffect, useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { temporaryUserStore } from "../stores/temporaryUserStore";
import { AuthUser } from "../types/Auth";

export default function ProfilePage() {
  const [user, setUser] = useState<AuthUser | null>(null);

  const handleLogout = async () => {
    await temporaryUserStore.removeAuthUser();
  };

  const openGithub = () => {
    if (user?.url) {
      Linking.openURL(user.url);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await temporaryUserStore.getAuthUser();

      setUser(userData);
    };

    fetchUserData();
  }, []);

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
    backgroundColor: "#f0f2f5",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#ccc",
  },

  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  followers: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },

  followings: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },

  github: {
    fontSize: 16,
    color: "#0366d6",
    textDecorationLine: "underline",
    marginBottom: 30,
  },

  logoutButton: {
    backgroundColor: "#ff4757",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
