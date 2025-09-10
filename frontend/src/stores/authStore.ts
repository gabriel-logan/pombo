import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthUser } from "../types/Auth";

interface AuthState {
  token: string | null;
  isLoggedIn: boolean;
  user: AuthUser | null;

  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore: AuthState = {
  token: null,
  isLoggedIn: false,
  user: null,

  signIn: async (user: AuthUser) => {
    useAuthStore.token = user.accessToken;
    useAuthStore.isLoggedIn = true;
    useAuthStore.user = user;
    await AsyncStorage.setItem("@pombo:token", user.accessToken);
  },

  signOut: async () => {
    useAuthStore.token = null;
    useAuthStore.isLoggedIn = false;
    useAuthStore.user = null;
    await AsyncStorage.removeItem("@pombo:token");
  },
};
