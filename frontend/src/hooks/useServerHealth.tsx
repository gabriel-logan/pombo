import { useEffect, useState } from "react";

import apiInstance from "../lib/apiInstance";
import { getSocket } from "../lib/socketInstance";
import { useUserStore } from "../stores/userStore";

export function useServerHealth(intervalMs = 5000) {
  const { setServerIsAlive, setSocketIsAlive } = useUserStore();

  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function checkServerAlive() {
      setIsChecking(true);

      try {
        const response = await apiInstance.get("/");
        setServerIsAlive(response.status === 200);
      } catch {
        setServerIsAlive(false);
      }

      const socket = getSocket();

      if (socket) {
        socket.emit("check-alive", (data: { status: boolean }) => {
          setSocketIsAlive(data.status);
        });

        if (socket.disconnected) setSocketIsAlive(false);
      }

      setIsChecking(false);
    }

    checkServerAlive();
    const id = setInterval(checkServerAlive, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, setServerIsAlive, setSocketIsAlive]);

  return { isChecking };
}
