import { create } from "zustand";

interface UserState {
  isOnline: {
    userId: number | null;
    status: boolean;
  }[];

  setIsOnline: (userId: number, status: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  isOnline: [],

  setIsOnline: (userId, status) =>
    set((state) => ({
      isOnline: state.isOnline
        .filter((u) => u.userId !== userId)
        .concat({ userId, status }),
    })),
}));
