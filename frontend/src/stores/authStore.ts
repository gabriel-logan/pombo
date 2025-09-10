import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

import {
  disconnectSocket,
  initSocket,
  updateSocketToken,
} from "../lib/socketInstance";
import type { AuthUser } from "../types/Auth";
import { authStoreKey } from "../utils/constants";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: AuthUser | null;

  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;

  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoggedIn: false,
  user: null,

  signIn: async (user) => {
    const { accessToken } = user;

    await AsyncStorage.setItem(authStoreKey, JSON.stringify(user));

    set({ token: accessToken, isLoggedIn: true, user });

    updateSocketToken(accessToken);
  },

  signOut: async () => {
    await AsyncStorage.removeItem(authStoreKey);

    set({ token: null, isLoggedIn: false, user: null });

    disconnectSocket();
  },

  restoreSession: async () => {
    const storedUser = await AsyncStorage.getItem(authStoreKey);

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading time

    if (storedUser) {
      try {
        const user: AuthUser = JSON.parse(storedUser);

        set({ token: user.accessToken, isLoggedIn: true, user });

        initSocket(user.accessToken);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to parse user data:", error);

        initSocket();
      }
    } else {
      initSocket();
    }
  },
}));
