import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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

export default function MainPage() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => navigation.navigate("Chat")}
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
    backgroundColor: "#fff",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
    color: "#000",
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});
