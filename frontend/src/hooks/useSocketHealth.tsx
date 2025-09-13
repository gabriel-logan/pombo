import { useEffect } from "react";

import { getSocket } from "../lib/socketInstance";
import { useUserStore } from "../stores/userStore";

export function useSocketHealth(intervalMs = 5000) {
  const { setSocketIsAlive } = useUserStore();

  useEffect(() => {
    function checkSocketAlive() {
      const socket = getSocket();

      if (!socket) return;

      socket.emit("check-alive", (data: { status: boolean }) => {
        setSocketIsAlive((prev) => (prev !== data.status ? data.status : prev));
      });

      if (socket.disconnected) {
        setSocketIsAlive(false);
      }
    }

    checkSocketAlive();
    const interval = setInterval(checkSocketAlive, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, setSocketIsAlive]);
}
