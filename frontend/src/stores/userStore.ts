import type { Dispatch } from "react";
import { create } from "zustand";

interface UserState {
  isOnline: {
    userId: number | null;
    status: boolean;
  }[];
  isLoading: boolean;
  socketIsAlive: boolean;

  setIsOnline: (userId: number, status: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSocketIsAlive: Dispatch<React.SetStateAction<boolean>>;
}

export const useUserStore = create<UserState>((set) => ({
  isOnline: [],
  isLoading: false,
  socketIsAlive: false,

  setIsOnline: (userId, status) =>
    set((state) => ({
      isOnline: state.isOnline
        .filter((u) => u.userId !== userId)
        .concat({ userId, status }),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSocketIsAlive: (callback) =>
    set((state) => ({
      socketIsAlive:
        typeof callback === "function"
          ? callback(state.socketIsAlive)
          : callback,
    })),
}));
