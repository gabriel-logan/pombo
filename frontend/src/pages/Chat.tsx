import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const messages = [
  { id: "1", text: "Oi, tudo bem?", sender: "other" },
  { id: "2", text: "Tudo ótimo! E você?", sender: "me" },
  { id: "3", text: "Também! Bora marcar algo?", sender: "other" },
  { id: "4", text: "Bora sim 😄", sender: "me" },
];

export default function ChatPage() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="call" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="desktop-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* CHAT MESSAGES */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "me" ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* INPUT AREA */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    gap: 16,
  },
  chatArea: {
    flex: 1,
    padding: 12,
  },
  message: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: "#000",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 20,
  },
});
