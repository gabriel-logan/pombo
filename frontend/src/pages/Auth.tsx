import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { v4 as uuidv4 } from "uuid";

import { RootNativeStackScreenProps } from "../types/Navigation";
import colors from "../utils/colors";
import { githubPublic } from "../utils/env/github";

type AuthPageProps = RootNativeStackScreenProps<"AuthPage">;

const { githubOauthEndpoint, githubClientId, githubRedirectUri } = githubPublic;

export default function AuthPage() {
  const [params, setParams] = useState<Linking.QueryParams | null>(null);

  const navigation = useNavigation<AuthPageProps["navigation"]>();

  async function signInWithGitHub() {
    const randomState = uuidv4();

    const authUrl = `${githubOauthEndpoint}?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&state=${randomState}`;

    await Linking.openURL(authUrl);
  }

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const parsed = Linking.parse(url);

        setParams(parsed.queryParams);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      const parsed = Linking.parse(url);

      setParams(parsed.queryParams);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (params?.code) {
      async function getUser() {
        try {
          const response = await fetch(
            "http://localhost:3000/auth/github/sign-in",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                code: params?.code,
              }),
            },
          );

          const data = await response.json();

          console.log("Access Token Response:", data);

          Alert.alert("Success", "You have been signed in successfully!");
        } catch (error) {
          console.error("Erro ao trocar code pelo token:", error);
          Alert.alert("Error", "Failed to sign in. Please try again.");
        }
      }

      getUser();
    }
  }, [params]);

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
