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
  ChatPage: {
    myId: number;
    otherId: number;
    otherAvatarUrl: string;
    otherUsername: string;
  };
};

export type RootNativeStackScreenProps<
  T extends keyof RootNativeStackParamList,
> = NativeStackScreenProps<RootNativeStackParamList, T>;

// Root Drawer Navigator
export type RootDrawerParamList = {
  ProfilePage: undefined;
  MainPage: undefined;
  SettingsPage: undefined;
};

export type RootDrawerScreenProps<T extends keyof RootDrawerParamList> =
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList, T>,
    RootNativeStackScreenProps<keyof RootNativeStackParamList>
  >;

// Global Param List
export type GlobalParamList = RootDrawerParamList & RootNativeStackParamList;

// Extend ReactNavigation namespace to include GlobalParamList
declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends GlobalParamList {}
  }
}
