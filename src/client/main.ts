import type { Socket } from "socket.io-client";
import type { CheckChatDto } from "src/chat/dto/check-chat.dto";

declare const io: () => Socket;

const socket = io();

socket.emit("chat-alive", (data: CheckChatDto) => {
  const serverStatusP = document.getElementById(
    "server-status",
  ) as HTMLParagraphElement;

  serverStatusP.innerText = String(data.status);
});
