import AsyncStorage from "@react-native-async-storage/async-storage";

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

export const useAuthStore: AuthState = {
  token: null,
  isLoggedIn: false,
  user: null,

  signIn: async (user: AuthUser) => {
    useAuthStore.token = user.accessToken;
    useAuthStore.isLoggedIn = true;
    useAuthStore.user = user;
    await AsyncStorage.setItem(authStoreKey, JSON.stringify(user));
    updateSocketToken(user.accessToken);
  },

  signOut: async () => {
    useAuthStore.token = null;
    useAuthStore.isLoggedIn = false;
    useAuthStore.user = null;
    await AsyncStorage.removeItem(authStoreKey);
    disconnectSocket();
  },

  restoreSession: async () => {
    const userData = await AsyncStorage.getItem(authStoreKey);

    if (userData) {
      try {
        const user: AuthUser = JSON.parse(userData);

        useAuthStore.token = user.accessToken;
        useAuthStore.isLoggedIn = true;
        useAuthStore.user = user;
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
};
