import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { FontAwesome6 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

import apiInstance from "../lib/apiInstance";
import { temporaryUserStore } from "../stores/temporaryUserStore";
import type { AuthUser } from "../types/Auth";
import { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";
import { githubPublic } from "../utils/env/github";

type AuthPageProps = RootNativeStackScreenProps<"AuthPage">;

const { githubOauthEndpoint, githubClientId, githubRedirectUri } = githubPublic;

export default function AuthPage() {
  const [params, setParams] = useState<Linking.QueryParams | null>(null);

  const consumedRef = useRef(false); // To prevent multiple consumptions of the same code

  const navigation = useNavigation<AuthPageProps["navigation"]>();

  async function signInWithGitHub() {
    const randomState = uuidv4();

    const authUrl = `${githubOauthEndpoint}?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&state=${randomState}`;

    await Linking.openURL(authUrl);
  }

  function handleUrlString(url?: string | null) {
    if (!url) return;

    const parsed = Linking.parse(url);

    const code = parsed.queryParams?.code;

    if (code && !consumedRef.current) {
      consumedRef.current = true;

      setParams(parsed.queryParams);
    }
  }

  useEffect(() => {
    async function checkAuth() {
      const userData = await temporaryUserStore.getAuthUser();

      if (userData) {
        navigation.reset({
          index: 0,
          routes: [{ name: "RootDrawerNavigator" }],
        });
      }
    }

    checkAuth();
  }, [navigation]);

  useEffect(() => {
    Linking.getInitialURL().then(handleUrlString);

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrlString(url);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    async function getUser(code?: string) {
      try {
        const response = await apiInstance.post<AuthUser>(
          "/auth/github/sign-in",
          {
            code,
          },
        );

        console.log(response.data);

        // Save the token in local storage
        await AsyncStorage.setItem("@pombo", JSON.stringify(response.data));

        navigation.reset({
          index: 0,
          routes: [{ name: "RootDrawerNavigator" }],
        });
      } catch {
        await AsyncStorage.removeItem("@pombo");

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
      }
    }

    if (params?.code) {
      getUser();
    }
  }, [navigation, params]);

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
