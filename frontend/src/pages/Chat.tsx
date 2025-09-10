import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import BtnGoBack from "../components/BtnGoBack";
import { initDB, loadMessages, saveMessage } from "../lib/chatDB";
import { getSocket } from "../lib/socketInstance";
import { ChatNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type ChatPageProps = ChatNativeStackScreenProps<"ChatPage">;

function getRoomId(userId1: number, userId2: number) {
  return [userId1, userId2].sort((a, b) => a - b).join("_");
}

export default function ChatPage() {
  const { params } = useRoute<ChatPageProps["route"]>();

  const { myId, otherId } = params;

  const roomId = getRoomId(myId, otherId);

  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    [],
  );

  const [textInput, setTextInput] = useState("");

  function sendMessage(text: string) {
    if (text.trim() === "") return;

    const socket = getSocket();

    socket?.emit("send-message", {
      room: roomId,
      message: text,
      senderId: myId,
    });

    setTextInput("");
  }

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      try {
        await initDB();

        const saved = await loadMessages(roomId);

        if (isMounted) {
          setMessages(saved);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Erro ao inicializar banco:", err);
      }
    }

    setup();

    const socket = getSocket();

    socket?.emit("join-room", roomId);

    socket?.on("new-message", async (data) => {
      const newMsg = {
        text: data.message,
        sender: data.senderId === myId ? "me" : "other",
      };

      if (isMounted) {
        setMessages((prev) => [...prev, newMsg]);
      }

      try {
        await saveMessage(roomId, data.message, newMsg.sender);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Erro ao salvar mensagem:", err);
      }
    });

    return () => {
      isMounted = false;
      socket?.emit("leave-room", roomId);
      socket?.off("new-message");
    };
  }, [myId, roomId]);

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
        style={styles.chatArea}
        ListEmptyComponent={
          <Text style={styles.noMessage}>No messages found.</Text>
        }
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
          value={textInput}
          onChangeText={setTextInput}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage(textInput)}
        >
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

  noMessage: {
    flex: 1,
    color: colors.light.textSecondary,
    fontSize: 16,
    textAlign: "center",
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
