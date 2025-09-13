import { useEffect } from "react";

import apiInstance from "../lib/apiInstance";
import { useUserStore } from "../stores/userStore";

export function useServerHealth(intervalMs = 10000) {
  const { setServerIsAlive } = useUserStore();

  useEffect(() => {
    let cancelled = false;

    async function checkServerAlive() {
      try {
        const res = await apiInstance.get("/");

        if (!cancelled) {
          setServerIsAlive(res.status === 200);
        }
      } catch {
        if (!cancelled) {
          setServerIsAlive(false);
        }
      }
    }

    checkServerAlive();
    const interval = setInterval(checkServerAlive, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [intervalMs, setServerIsAlive]);
}
