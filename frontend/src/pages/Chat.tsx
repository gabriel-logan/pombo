import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import BtnGoBack from "../components/BtnGoBack";
import { initDB, loadMessages, saveMessage } from "../lib/chatDB";
import { getSocket } from "../lib/socketInstance";
import { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type ChatPageProps = RootNativeStackScreenProps<"ChatPage">;

function getRoomId(userId1: number, userId2: number) {
  return [userId1, userId2].sort((a, b) => a - b).join("_");
}

export default function ChatPage() {
  const { params } = useRoute<ChatPageProps["route"]>();

  const { myId, otherId, otherAvatarUrl, otherUsername } = params;

  const roomId = getRoomId(myId, otherId);

  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    [],
  );

  const [textInput, setTextInput] = useState("");

  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<"online" | "offline">("offline");

  function sendMessage(text: string) {
    if (text.trim() === "") return;

    const socket = getSocket();

    socket?.emit("send-message", {
      room: roomId,
      message: text,
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
  }, [myId, otherId, roomId]);

  useEffect(() => {
    const socket = getSocket();
    let typingTimeout: NodeJS.Timeout;

    if (textInput.length > 0) {
      socket?.emit("typing", { room: roomId });

      typingTimeout = setTimeout(() => {
        socket?.emit("stop-typing", { room: roomId });
      }, 1000); // 1s depois de parar de digitar
    } else {
      socket?.emit("stop-typing", { room: roomId });
    }

    return () => clearTimeout(typingTimeout);
  }, [myId, roomId, textInput.length]);

  useEffect(() => {
    const socket = getSocket();

    socket?.on("user-typing", ({ senderId }) => {
      if (senderId === otherId) setTyping(true);
    });

    socket?.on("user-stop-typing", ({ senderId }) => {
      if (senderId === otherId) setTyping(false);
    });

    return () => {
      socket?.off("user-typing");
      socket?.off("user-stop-typing");
    };
  }, [otherId]);

  useEffect(() => {
    const socket = getSocket();

    socket?.emit("check-online-status", otherId, (res: { online: boolean }) => {
      setStatus(res.online ? "online" : "offline");
    });

    socket?.on("user-online", ({ userId }) => {
      if (userId === otherId) {
        setStatus("online");
      }
    });

    socket?.on("user-offline", ({ userId }) => {
      if (userId === otherId) {
        setStatus("offline");
      }
    });

    return () => {
      socket?.off("user-online");
      socket?.off("user-offline");
    };
  }, [otherId]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.light.backgroundCard }}
    >
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
            <BtnGoBack />

            <View style={styles.headerTitle}>
              <Image source={{ uri: otherAvatarUrl }} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{otherUsername}</Text>
                <Text style={styles.status}>Status: {status}</Text>
              </View>
            </View>

            <View style={styles.iconsRight}>
              {(
                [
                  "call-outline",
                  "videocam-outline",
                  "desktop-outline",
                ] as (keyof typeof Ionicons.glyphMap)[]
              ).map((icon) => (
                <TouchableOpacity key={icon}>
                  <Ionicons name={icon} size={22} color="#4A90E2" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* CHAT MESSAGES */}
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            style={styles.chatArea}
            contentContainerStyle={{ paddingBottom: 20 }}
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

          {/* Typing */}
          {typing && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>
                {otherUsername} is typing...
              </Text>
            </View>
          )}

          {/* INPUT AREA */}
          <View style={styles.inputBar}>
            {(
              [
                "happy-outline",
                "attach-outline",
              ] as (keyof typeof Ionicons.glyphMap)[]
            ).map((icon) => (
              <TouchableOpacity key={icon}>
                <Ionicons
                  name={icon}
                  size={22}
                  color="#666"
                  style={styles.icon}
                />
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.input}
              placeholder="Digite uma mensagem..."
              placeholderTextColor="#aaa"
              value={textInput}
              onChangeText={setTextInput}
            />

            {textInput.trim() !== "" && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={() => sendMessage(textInput)}
              >
                <Ionicons name="send" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundApp,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderLight,
    backgroundColor: colors.light.backgroundCard,
    elevation: 2,
  },

  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.borderLight,
  },

  username: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.textMain,
  },

  status: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },

  iconsRight: {
    flexDirection: "row",
    gap: 14,
  },

  chatArea: {
    flex: 1,
    padding: 14,
  },

  typingContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },

  typingText: {
    fontStyle: "italic",
    color: colors.light.textSecondary,
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
    marginHorizontal: 2,
  },

  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    backgroundColor: colors.light.backgroundInput,
    marginHorizontal: 4,
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
