const githubOauthEndpoint: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_OAUTH_ENDPOINT;

const githubClientId: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;

const githubRedirectUri: string | undefined =
  process.env.EXPO_PUBLIC_GITHUB_REDIRECT_URI;

if (!githubOauthEndpoint || !githubClientId || !githubRedirectUri) {
  throw new Error("GitHub OAuth environment variables are not set properly.");
}

export const githubPublic = {
  githubOauthEndpoint,
  githubClientId,
  githubRedirectUri,
};
