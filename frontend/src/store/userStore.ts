import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  bearerToken: string | null;
  setBearerToken: (token: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      bearerToken: null,
      setBearerToken: (token: string) => set({ bearerToken: token }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
