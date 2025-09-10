import AsyncStorage from "@react-native-async-storage/async-storage";

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
  },

  signOut: async () => {
    useAuthStore.token = null;
    useAuthStore.isLoggedIn = false;
    useAuthStore.user = null;
    await AsyncStorage.removeItem(authStoreKey);
  },

  restoreSession: async () => {
    const userData = await AsyncStorage.getItem(authStoreKey);

    if (userData) {
      let user: AuthUser;

      try {
        user = JSON.parse(userData);
      } catch (error) {
        // eslint-disable-next-line no-console
        return console.error("Failed to parse user data:", error);
      }

      useAuthStore.token = user.accessToken;
      useAuthStore.isLoggedIn = true;
      useAuthStore.user = user;
    }
  },
};
