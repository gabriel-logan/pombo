import { Platform } from "react-native";

const githubOauthEndpoint: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_OAUTH_ENDPOINT;

const githubClientId: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

let githubRedirectUri: string | undefined;

if (Platform.OS === "web") {
  githubRedirectUri = process.env.EXPO_PUBLIC_GITHUB_REDIRECT_WEB_URI;
} else if (Platform.OS === "android") {
  githubRedirectUri = process.env.EXPO_PUBLIC_GITHUB_REDIRECT_ANDROID_URI;
}

if (!githubOauthEndpoint || !githubClientId || !githubRedirectUri) {
  throw new Error("GitHub OAuth environment variables are not set properly.");
}

export const githubPublic = {
  githubOauthEndpoint,
  githubClientId,
  githubRedirectUri,
};
