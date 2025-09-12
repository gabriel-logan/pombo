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
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";
import { RootDrawerScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type MainPageProps = RootDrawerScreenProps<"MainPage">;

export default function MainPage() {
  const { user } = useAuthStore((state) => state);
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
        renderItem={({ item }) => (
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
            </View>
          </TouchableOpacity>
        )}
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
    elevation: 2, // leve sombra no Android
    shadowColor: "#000", // leve sombra no iOS
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
});
