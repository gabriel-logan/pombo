import { Platform } from "react-native";
import * as Linking from "expo-linking";
import { v4 as uuidv4 } from "uuid";

import { githubPublic } from "../utils/env/github";

const { githubOauthEndpoint, githubClientId, githubRedirectUri } = githubPublic;

export default async function signInWithGitHub() {
  const randomState =
    Platform.OS === "web"
      ? uuidv4()
      : Math.random().toString(36).substring(2, 15);

  const authUrl = `${githubOauthEndpoint}?client_id=${githubClientId}&redirect_uri=${githubRedirectUri}&state=${randomState}`;

  await Linking.openURL(authUrl);
}
