import type { DrawerScreenProps } from "@react-navigation/drawer";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootNativeStackParamList = {
  AuthPage: undefined;
  RootDrawerNavigator: NavigatorScreenParams<RootDrawerParamList>;
};

export type RootNativeStackScreenProps<
  T extends keyof RootNativeStackParamList,
> = CompositeScreenProps<
  NativeStackScreenProps<RootNativeStackParamList, T>,
  DrawerScreenProps<RootDrawerParamList>
>;

export type RootDrawerParamList = {
  ProfilePage: undefined;
  ChatNativeStackNavigator: NavigatorScreenParams<ChatNativeStackParamList>;
  SettingsPage: undefined;
};

export type RootDrawerScreenProps<T extends keyof RootDrawerParamList> =
  DrawerScreenProps<RootDrawerParamList, T>;

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

type GlobalParamList = RootDrawerParamList & ChatNativeStackParamList;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends GlobalParamList {}
  }
}
