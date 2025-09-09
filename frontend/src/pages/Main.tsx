import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ChatNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

const chats = [
  {
    id: "1",
    name: "Maria Silva",
    lastMessage: "Oi, tudo bem?",
    avatar: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: "2",
    name: "João Souza",
    lastMessage: "Vamos amanhã?",
    avatar: "https://i.pravatar.cc/100?img=2",
  },
  {
    id: "3",
    name: "Grupo Devs",
    lastMessage: "Código atualizado no GitHub",
    avatar: "https://i.pravatar.cc/100?img=3",
  },
];

type MainPageProps = ChatNativeStackScreenProps<"MainPage">;

export default function MainPage() {
  const navigation = useNavigation<MainPageProps["navigation"]>();

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate("ChatPage")}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.lastMessage}>{item.lastMessage}</Text>
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
