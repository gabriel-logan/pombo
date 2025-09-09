import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BtnGoBack from "../components/BtnGoBack";
import colors from "../utils/colors";

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
        <BtnGoBack />
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="desktop-outline" size={24} color="#4A90E2" />
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
            <Text
              style={[
                styles.messageText,
                item.sender === "me" && { color: "#fff" },
              ]}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {/* INPUT AREA */}
      <View style={styles.inputBar}>
        <TouchableOpacity>
          <Ionicons
            name="happy-outline"
            size={24}
            color="#666"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons
            name="attach-outline"
            size={22}
            color="#666"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="image-outline"
            size={22}
            color="#666"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="videocam-outline"
            size={22}
            color="#666"
            style={styles.icon}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Digite uma mensagem..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundApp,
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
    backgroundColor: colors.light.backgroundCard,
    gap: 20,
    elevation: 2,
  },

  chatArea: {
    flex: 1,
    padding: 14,
  },

  message: {
    maxWidth: "75%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginVertical: 5,
    shadowColor: colors.light.textMain,
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  myMessage: {
    backgroundColor: colors.light.backgroundMyMessage,
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },

  otherMessage: {
    backgroundColor: colors.light.backgroundOtherMessage,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
  },

  messageText: {
    fontSize: 15,
    color: colors.light.textMain,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light.borderLight,
    backgroundColor: colors.light.backgroundCard,
  },

  icon: {
    marginHorizontal: 6,
  },

  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: colors.light.backgroundInput,
    marginHorizontal: 8,
    fontSize: 15,
    color: colors.light.textMain,
  },

  sendButton: {
    backgroundColor: colors.light.brandPrimary,
    padding: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
