import { create } from "zustand";

interface UserState {
  isOnline: {
    userId: number | null;
    status: boolean;
  }[];
  isLoading: boolean;
  socketIsAlive: boolean;
  serverIsAlive: boolean;

  setIsOnline: (userId: number, status: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setSocketIsAlive: (alive: boolean) => void;
  setServerIsAlive: (alive: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isOnline: [],
  isLoading: false,
  socketIsAlive: false,
  serverIsAlive: false,

  setIsOnline: (userId, status) =>
    set((state) => ({
      isOnline: state.isOnline
        .filter((u) => u.userId !== userId)
        .concat({ userId, status }),
    })),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setSocketIsAlive: (alive) => set({ socketIsAlive: alive }),
  setServerIsAlive: (alive) => set({ serverIsAlive: alive }),
}));
