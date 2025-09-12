import { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import { RootDrawerScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type MainPageProps = RootDrawerScreenProps<"MainPage">;

export default function MainPage() {
  const { user } = useAuthStore((state) => state);
  const { isOnline } = useUserStore((state) => state);

  const navigation = useNavigation<MainPageProps["navigation"]>();

  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    if (!user?.following.info) return [];
    return user.following.info.filter((u) =>
      u.login.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, user?.following.info]);

  return (
    <SafeAreaView
      style={styles.container}
      edges={
        Platform.OS === "android" ? ["bottom", "left", "right"] : undefined
      }
    >
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search user..."
          placeholderTextColor={colors.light.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No followings found</Text>
        }
        renderItem={({ item }) => {
          const userStatus = isOnline.find((u) => u.userId === item.id);
          const statusColor = userStatus?.status
            ? colors.light.statusSuccess
            : colors.light.statusError;

          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate("ChatPage", {
                  myId: user!.id,
                  otherId: item.id,
                  otherAvatarUrl: item.avatar_url,
                  otherUsername: item.login,
                })
              }
            >
              <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.login}</Text>
                <Text style={styles.lastMessage}>{item.url}</Text>
                <View style={styles.statusView}>
                  <Text style={styles.status}>Status:</Text>
                  <Text style={styles.status}>
                    {userStatus?.status ? "Online" : "Offline"}
                  </Text>
                  <Octicons name="dot-fill" size={16} color={statusColor} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundCard,
  },

  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
    backgroundColor: colors.light.backgroundInput,
  },

  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
    fontSize: 15,
    color: colors.light.textMain,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: colors.light.textSecondary,
  },

  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.textMain,
  },

  lastMessage: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 2,
  },

  statusView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  status: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 4,
  },
});
