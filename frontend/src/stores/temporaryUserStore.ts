import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AuthUser } from "../types/Auth";

export const temporaryUserStore = {
  getAuthUser: async () => {
    const jsonValue = await AsyncStorage.getItem("@pombo");
    return jsonValue ? (JSON.parse(jsonValue) as AuthUser) : null;
  },
  setAuthUser: async (user: AuthUser) => {
    await AsyncStorage.setItem("@pombo", JSON.stringify(user));
  },
  removeAuthUser: async () => {
    await AsyncStorage.removeItem("@pombo");
  },
};
