import { useEffect, useRef, useState } from "react";
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
import Loading from "../components/Loading";
import { initDB, loadMessages, Message, saveMessage } from "../lib/chatDB";
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

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [status, setStatus] = useState<"online" | "offline">("offline");
  const [typing, setTyping] = useState(false);
  // With debounce - typing indicator
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  async function handleSendMessage() {
    if (!textInput.trim()) return;

    const socket = getSocket();

    const clientMsgId = `${Date.now()}-${Math.random()}`;

    // Local immediate message
    const newMsg: Message = {
      id: Date.now(),
      roomId,
      text: textInput,
      sender: "me",
      createdAt: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);

    await saveMessage(roomId, newMsg.text, "me");

    socket?.emit("send-message", {
      room: roomId,
      message: textInput,
      clientMsgId,
    });

    setTextInput("");
  }

  useEffect(() => {
    const socket = getSocket();

    async function setup() {
      try {
        await initDB();

        const loadedMessages = await loadMessages(roomId);

        setMessages(loadedMessages);

        socket?.emit("join-room", roomId);

        // Receive new messages
        socket?.on("new-message", async (data) => {
          const newMsg: Message = {
            id: Date.now(),
            roomId,
            text: data.message,
            sender: data.senderId === myId ? "me" : "other",
            createdAt: data.timestamp,
          };

          await saveMessage(roomId, newMsg.text, newMsg.sender);
          setMessages((prev) => [...prev, newMsg]);
        });

        // Status online/offline
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

        // Typing indicator
        socket?.on("user-typing", ({ senderId }) => {
          if (senderId === otherId) {
            setTyping(true);
          }
        });
        socket?.on("user-stop-typing", ({ senderId }) => {
          if (senderId === otherId) {
            setTyping(false);
          }
        });

        // Check if the other user is online
        socket?.emit(
          "check-online-status",
          otherId,
          (res: { online: boolean }) => {
            setStatus(res.online ? "online" : "offline");
          },
        );
      } finally {
        setIsLoading(false);
      }
    }

    setup();

    return () => {
      socket?.emit("leave-room", roomId);
      socket?.off("new-message");
      socket?.off("user-online");
      socket?.off("user-offline");
      socket?.off("user-typing");
      socket?.off("user-stop-typing");
    };
  }, [myId, otherId, roomId]);

  // Typing indicator emitter
  useEffect(() => {
    const socket = getSocket();

    if (textInput.trim() !== "") {
      socket?.emit("typing", { room: roomId, senderId: myId });

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      typingTimeout.current = setTimeout(() => {
        socket?.emit("stop-typing", { room: roomId, senderId: myId });
      }, 1250);
    } else {
      socket?.emit("stop-typing", { room: roomId, senderId: myId });

      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    }

    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, [myId, roomId, textInput]);

  if (isLoading) {
    return <Loading />;
  }

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
                onPress={handleSendMessage}
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
