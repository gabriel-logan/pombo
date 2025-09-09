import type { DrawerScreenProps } from "@react-navigation/drawer";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// Root Stack Navigator
export type RootNativeStackParamList = {
  AuthPage: undefined;
  RootDrawerNavigator: NavigatorScreenParams<RootDrawerParamList> | undefined;
};

export type RootNativeStackScreenProps<
  T extends keyof RootNativeStackParamList,
> = NativeStackScreenProps<RootNativeStackParamList, T>;

// Root Drawer Navigator
export type RootDrawerParamList = {
  ProfilePage: undefined;
  ChatNativeStackNavigator:
    | NavigatorScreenParams<ChatNativeStackParamList>
    | undefined;
  SettingsPage: undefined;
};

export type RootDrawerScreenProps<T extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, T>,
    RootNativeStackScreenProps<keyof RootNativeStackParamList>
  >;

// Chat Stack Navigator
export type ChatNativeStackParamList = {
  MainPage: undefined;
  ChatPage: undefined;
};

export type ChatNativeStackScreenProps<
  T extends keyof ChatNativeStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<ChatNativeStackParamList, T>,
  RootDrawerScreenProps<keyof RootDrawerParamList>
>;

// Global Param List
export type GlobalParamList = RootDrawerParamList &
  ChatNativeStackParamList &
  RootNativeStackParamList;

// Extend ReactNavigation namespace to include GlobalParamList
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends GlobalParamList {}
  }
}
