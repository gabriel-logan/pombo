import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

import Loading from "../components/Loading";
import apiInstance from "../lib/apiInstance";
import { useAuthStore } from "../stores/authStore";
import type { AuthUser } from "../types/Auth";
import { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";
import { githubPublic } from "../utils/env/github";

type AuthPageProps = RootNativeStackScreenProps<"AuthPage">;

const { githubOauthEndpoint, githubClientId, githubRedirectUri } = githubPublic;

export default function AuthPage() {
  const { isLoggedIn, signIn, signOut } = useAuthStore;

  const [isLoading, setIsLoading] = useState(true);

  const [params, setParams] = useState<Linking.QueryParams | null>(null);

  const consumedRef = useRef(false); // To prevent multiple consumptions of the same (QUERY) code

  const navigation = useNavigation<AuthPageProps["navigation"]>();

  async function signInWithGitHub() {
    const randomState = uuidv4();

    const authUrl = `${githubOauthEndpoint}?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&state=${randomState}`;

    await Linking.openURL(authUrl);
  }

  useEffect(() => {
    async function checkAuth() {
      try {
        if (isLoggedIn) {
          navigation.reset({
            index: 0,
            routes: [{ name: "RootDrawerNavigator" }],
          });
        }
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [isLoggedIn, navigation]);

  useEffect(() => {
    function handleUrlString(url?: string | null) {
      if (!url) return;

      const parsed = Linking.parse(url);

      const code = parsed.queryParams?.code;

      if (code && !consumedRef.current) {
        consumedRef.current = true;

        setParams(parsed.queryParams);
      }
    }

    Linking.getInitialURL().then(handleUrlString);

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrlString(url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (params?.code) {
      setIsLoading(true);

      async function getUser() {
        try {
          const response = await apiInstance.post<AuthUser>(
            "/auth/github/sign-in",
            {
              code: params?.code,
            },
          );

          console.log(response.data);

          // Save the token in local storage
          await signIn(response.data);

          navigation.reset({
            index: 0,
            routes: [{ name: "RootDrawerNavigator" }],
          });
        } catch {
          await signOut();

          consumedRef.current = false;
        } finally {
          // Clean up the URL parameters
          setParams(null);

          // Clean the URL in web environment
          if (
            Platform.OS === "web" &&
            typeof window !== "undefined" &&
            window.history?.replaceState
          ) {
            const clean = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, clean);
          }

          setIsLoading(false);
        }
      }

      getUser();
    }
  }, [navigation, params?.code, signIn, signOut]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>
      <View style={styles.buttonContainer}>
        <FontAwesome6.Button
          name="github"
          backgroundColor={colors.light.btnGithubBackground}
          onPress={signInWithGitHub}
          style={styles.githubButton}
        >
          <Text style={styles.githubButtonText}>Sign in with GitHub</Text>
        </FontAwesome6.Button>
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

  githubButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  githubButtonText: {
    color: colors.light.btnGithubText,
    fontSize: 16,
    fontWeight: "600",
  },
});
