import type { Socket } from "socket.io-client";

declare const io: () => Socket;

const socket = io();

socket.emit("is-alive", (data: { status: boolean }) => {
  const serverStatusP = document.getElementById(
    "server-status",
  ) as HTMLParagraphElement;

  serverStatusP.innerText = String(data.status);
});
