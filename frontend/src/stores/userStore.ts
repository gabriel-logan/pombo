import { create } from "zustand";

interface UserState {
  isOnline: {
    userId: number | null;
    status: boolean;
  }[];
  isLoading: boolean;
  socketIsAlive: boolean;
  serverIsAlive: boolean;
  locales: string[];

  setIsOnline: (userId: number, status: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSocketIsAlive: (alive: boolean | ((prev: boolean) => boolean)) => void;
  setServerIsAlive: (alive: boolean) => void;
  setLocales: (locales: string[]) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isOnline: [],
  isLoading: false,
  socketIsAlive: false,
  serverIsAlive: false,
  locales: [],

  setIsOnline: (userId, status) =>
    set((state) => ({
      isOnline: state.isOnline
        .filter((u) => u.userId !== userId)
        .concat({ userId, status }),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSocketIsAlive: (alive) => {
    set((state) => ({
      socketIsAlive:
        typeof alive === "function" ? alive(state.socketIsAlive) : alive,
    }));
  },
  setServerIsAlive: (alive) => set({ serverIsAlive: alive }),
  setLocales: (locales) => set({ locales }),
}));
