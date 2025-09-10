import { Platform } from "react-native";

const githubOauthEndpoint: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_OAUTH_ENDPOINT;

let githubClientId: string | undefined;

let githubRedirectUri: string | undefined;

switch (Platform.OS) {
  case "web":
    githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_WEB;
    githubRedirectUri = process.env.EXPO_PUBLIC_GITHUB_REDIRECT_URI_WEB;
    break;
  case "android":
    githubClientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID_ANDROID;
    githubRedirectUri = process.env.EXPO_PUBLIC_GITHUB_REDIRECT_URI_ANDROID;
    break;
  default:
    throw new Error(`Unsupported platform: ${Platform.OS}`);
}

if (!githubOauthEndpoint || !githubClientId || !githubRedirectUri) {
  throw new Error("GitHub OAuth environment variables are not set properly.");
}

export const githubPublic = {
  githubOauthEndpoint,
  githubClientId,
  githubRedirectUri,
};
