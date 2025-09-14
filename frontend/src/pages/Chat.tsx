import { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

import BtnGoBack from "../components/BtnGoBack";
import Loading from "../components/Loading";
import {
  deleteChat,
  deleteMessage,
  initDB,
  loadMessages,
  saveMessage,
} from "../lib/chatDB";
import { getSocket } from "../lib/socketInstance";
import { useUserStore } from "../stores/userStore";
import type { Message, MessageWithoutID } from "../types/ChatDB";
import type { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type ChatPageProps = RootNativeStackScreenProps<"ChatPage">;

function getRoomId(userId1: number, userId2: number) {
  return [userId1, userId2].sort((a, b) => a - b).join("_");
}

export default function ChatPage() {
  const { socketIsAlive, isOnline, setIsOnline } = useUserStore();

  const { params } = useRoute<ChatPageProps["route"]>();

  const { myId, otherId, otherAvatarUrl, otherUsername } = params;

  const roomId = getRoomId(myId, otherId);

  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [typing, setTyping] = useState(false);

  // With debounce - typing indicator
  const typingTimeout = useRef<NodeJS.Timeout>(null);
  // FlatList reference
  const flatListRef = useRef<FlatList<Message>>(null);

  function notImplementedAlert() {
    if (Platform.OS === "web") {
      alert("This feature is not implemented yet.");
    } else {
      Alert.alert("Info", "This feature is not implemented yet.");
    }
  }

  async function handleSendMessage() {
    if (!textInput.trim()) return;

    if (socketIsAlive === false) {
      const alertSocketOffMsg =
        "Cannot send message: Socket is disconnected. Try logging out and back in or restarting the app. If the problem persists, please contact support.";

      if (Platform.OS === "web") {
        alert(alertSocketOffMsg);
      } else {
        Alert.alert("Error", alertSocketOffMsg);
      }

      return;
    }

    const socket = getSocket();

    const clientMsgId = `${Date.now()}-${Math.random()}`;

    // Local immediate message
    const newMsg: MessageWithoutID = {
      roomId,
      text: textInput,
      sender: "me",
      createdAt: Date.now(),
      status: "pending",
      clientMsgId,
    };

    const savedMsg = await saveMessage(newMsg);

    setMessages((prev) => [...prev, savedMsg]);

    socket?.emit("send-message", {
      room: savedMsg.roomId,
      message: savedMsg.text,
      clientMsgId: savedMsg.clientMsgId,
    });

    setTextInput("");
  }

  async function handleDeleteMessage(clientMsgId: string) {
    const socket = getSocket();

    await deleteMessage({ clientMsgId });

    setMessages((prev) =>
      prev.filter((msg) => msg.clientMsgId !== clientMsgId),
    );

    socket?.emit("delete-message", { room: roomId, clientMsgId });
  }

  async function handleDeleteChat() {
    const socket = getSocket();

    await deleteChat({ roomId });

    setMessages([]);

    socket?.emit("delete-chat", { room: roomId });
  }

  useEffect(() => {
    const socket = getSocket();

    async function setup() {
      try {
        await initDB();

        const loadedMessages = await loadMessages({ roomId });

        setMessages(loadedMessages);

        socket?.emit("join-room", roomId);

        // New message listener
        socket?.on("new-message", async (data) => {
          setMessages((prev) => {
            // Prevent duplicate messages using clientMsgId
            const alreadyExists = prev.some(
              (msg) => msg.clientMsgId && msg.clientMsgId === data.clientMsgId,
            );

            if (alreadyExists) {
              return prev;
            }

            const newMsg: MessageWithoutID = {
              roomId,
              text: data.message,
              sender: data.senderId === myId ? "me" : "other",
              createdAt: data.timestamp,
              clientMsgId: data.clientMsgId,
              status: "sent",
            };

            // Save incoming message to DB
            saveMessage(newMsg);

            return [...prev, { id: Date.now(), ...newMsg }];
          });
        });

        // Status online/offline
        socket?.on("user-online", ({ userId }) => {
          setIsOnline(userId, true);
        });

        socket?.on("user-offline", ({ userId }) => {
          setIsOnline(userId, false);
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
            setIsOnline(otherId, res.online);
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
  }, [myId, otherId, roomId, setIsOnline]);

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

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages.length]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <BtnGoBack />

          <View style={styles.headerTitle}>
            <Image source={{ uri: otherAvatarUrl }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{otherUsername}</Text>
              <Text style={styles.status}>
                Status:{" "}
                <Octicons
                  name="dot-fill"
                  size={16}
                  color={
                    isOnline.find((u) => u.userId === otherId && u.status)
                      ? colors.light.statusSuccess
                      : colors.light.statusError
                  }
                />{" "}
                {isOnline.find((u) => u.userId === otherId && u.status)
                  ? "Online"
                  : "Offline"}
              </Text>
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
              <TouchableOpacity key={icon} onPress={notImplementedAlert}>
                <Ionicons name={icon} size={22} color="#4A90E2" />
              </TouchableOpacity>
            ))}

            <View style={styles.iconsRight}>
              <TouchableOpacity
                onPress={async () => {
                  if (Platform.OS === "web") {
                    if (confirm("Do you want to delete ALL messages?")) {
                      return await handleDeleteChat();
                    }
                  } else {
                    Alert.alert(
                      "Excluir chat",
                      "Deseja apagar TODAS as mensagens?",
                      [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Apagar tudo",
                          style: "destructive",
                          onPress: () => {
                            return void handleDeleteChat();
                          },
                        },
                      ],
                    );
                  }
                }}
              >
                <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* CHAT MESSAGES */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(data) => data.clientMsgId}
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <Text style={styles.noMessage}>No messages found.</Text>
          }
          renderItem={({ item }) => {
            const date = new Date(item.createdAt);
            const formattedTime = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <TouchableOpacity
                onLongPress={async () => {
                  if (Platform.OS === "web") {
                    if (confirm("Do you want to delete this message?")) {
                      return await handleDeleteMessage(item.clientMsgId);
                    }
                  } else {
                    Alert.alert(
                      "Delete Message",
                      "Do you want to delete this message?",
                      [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => {
                            return void handleDeleteMessage(item.clientMsgId);
                          },
                        },
                      ],
                    );
                  }
                }}
              >
                <View
                  style={[
                    styles.message,
                    item.sender === "me"
                      ? styles.myMessage
                      : styles.otherMessage,
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

                  {/* Hora + Status */}
                  <View style={styles.metaContainer}>
                    <Text style={styles.timeText}>{formattedTime}</Text>
                    {item.sender === "me" && item.status && (
                      <View style={styles.statusIcon}>
                        {item.status === "pending" && (
                          <MaterialIcons
                            name="access-time"
                            size={14}
                            color="#ccc"
                          />
                        )}
                        {item.status === "sent" && (
                          <MaterialIcons name="check" size={14} color="#ccc" />
                        )}
                        {item.status === "delivered" && (
                          <MaterialIcons
                            name="done-all"
                            size={14}
                            color="#ccc"
                          />
                        )}
                        {item.status === "read" && (
                          <MaterialIcons
                            name="done-all"
                            size={14}
                            color="#4FC3F7"
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        {/* Typing */}
        {typing && (
          <View style={styles.typingContainer}>
            <Text style={styles.typingText}>{otherUsername} is typing...</Text>
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
            <TouchableOpacity key={icon} onPress={notImplementedAlert}>
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

  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },

  timeText: {
    fontSize: 10,
    color: "#ccc",
    marginRight: 4,
  },

  statusIcon: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
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
