import { useEffect } from "react";

import { getSocket } from "../lib/socketInstance";
import { useUserStore } from "../stores/userStore";

export function useSocketHealth() {
  const setSocketIsAlive = useUserStore((s) => s.setSocketIsAlive);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    function handleConnect() {
      setSocketIsAlive(true);
    }

    function handleDisconnect() {
      setSocketIsAlive(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleDisconnect);
    };
  }, [setSocketIsAlive]);
}
