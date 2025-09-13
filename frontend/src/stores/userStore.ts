import type { Dispatch } from "react";
import { create } from "zustand";

interface UserState {
  isOnline: {
    userId: number | null;
    status: boolean;
  }[];
  isLoading: boolean;
  serverIsAlive: boolean;

  setIsOnline: (userId: number, status: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setServerIsAlive: Dispatch<React.SetStateAction<boolean>>;
}

export const useUserStore = create<UserState>((set) => ({
  isOnline: [],
  isLoading: false,
  serverIsAlive: false,

  setIsOnline: (userId, status) =>
    set((state) => ({
      isOnline: state.isOnline
        .filter((u) => u.userId !== userId)
        .concat({ userId, status }),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setServerIsAlive: (callback) =>
    set((state) => ({
      serverIsAlive:
        typeof callback === "function"
          ? callback(state.serverIsAlive)
          : callback,
    })),
}));
