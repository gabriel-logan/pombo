import { useEffect, useState } from "react";

import apiInstance from "../lib/apiInstance";
import { useUserStore } from "../stores/userStore";

export function useServerHealth(intervalMs = 10000) {
  const setServerIsAlive = useUserStore((s) => s.setServerIsAlive);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      setIsChecking(true);
      try {
        const res = await apiInstance.get("/");
        if (!cancelled) setServerIsAlive(res.status === 200);
      } catch {
        if (!cancelled) setServerIsAlive(false);
      }
      if (!cancelled) setIsChecking(false);
    }

    check();

    const id = setInterval(check, intervalMs);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs, setServerIsAlive]);

  return { isChecking };
}
