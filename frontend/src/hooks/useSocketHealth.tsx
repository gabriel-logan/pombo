import { useEffect } from "react";

import { getSocket } from "../lib/socketInstance";
import { useUserStore } from "../stores/userStore";

export function useSocketHealth(intervalMs = 5000) {
  const setSocketIsAlive = useUserStore((s) => s.setSocketIsAlive);

  useEffect(() => {
    function checkServerAlive() {
      const socket = getSocket();

      if (!socket) return;

      socket.emit("check-alive", (data: { status: boolean }) => {
        setSocketIsAlive((prev) => (prev !== data.status ? data.status : prev));
      });

      if (socket.disconnected) {
        setSocketIsAlive(false);
      }
    }

    checkServerAlive();
    const interval = setInterval(checkServerAlive, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, setSocketIsAlive]);
}
