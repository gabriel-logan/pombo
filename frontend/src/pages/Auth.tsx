import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import signInWithGitHub from "../actions/signInWithGitHub";
import BtnSignInWithGithub from "../components/BtnSignInWithGithub";
import Loading from "../components/Loading";
import useOAuthHandler from "../hooks/useOAuthHandler";
import { useAuthStore } from "../stores/authStore";
import { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";

type AuthPageProps = RootNativeStackScreenProps<"AuthPage">;

export default function AuthPage() {
  const { isLoggedIn, signIn, signOut } = useAuthStore((state) => state);

  const navigation = useNavigation<AuthPageProps["navigation"]>();

  const [isLoading, setIsLoading] = useState(true);

  // Handle OAuth Sign-In flow
  useOAuthHandler(signIn, signOut, setIsLoading);

  // If already logged in, redirect to the main app
  useEffect(() => {
    if (isLoggedIn) {
      navigation.reset({ index: 0, routes: [{ name: "RootDrawerNavigator" }] });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigation]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <View style={styles.buttonContainer}>
        <BtnSignInWithGithub onPress={signInWithGitHub} disabled={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.backgroundApp,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.light.textMain,
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 18,
    color: colors.light.textSecondary,
    marginBottom: 40,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
});
