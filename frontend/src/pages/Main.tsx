import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";
import { ChatNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type MainPageProps = ChatNativeStackScreenProps<"MainPage">;

export default function MainPage() {
  const { user } = useAuthStore;

  const navigation = useNavigation<MainPageProps["navigation"]>();

  return (
    <View style={styles.container}>
      <FlatList
        data={user?.following.info}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No followings found</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate("ChatPage")}
          >
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.login}</Text>
              <Text style={styles.lastMessage}>{item.url}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundCard,
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
