import type { EnvSecretConfig } from "./types";

export default (): EnvSecretConfig => {
  if (
    !process.env.JWT_TOKEN_SECRET ||
    !process.env.JWT_TOKEN_EXPIRATION ||
    !process.env.GITHUB_OAUTH_ENDPOINT ||
    !process.env.GITHUB_API_ENDPOINT ||
    !process.env.GITHUB_CLIENT_ID_WEB ||
    !process.env.GITHUB_REDIRECT_URI_WEB ||
    !process.env.GITHUB_CLIENT_SECRET_WEB ||
    !process.env.GITHUB_CLIENT_ID_ANDROID ||
    !process.env.GITHUB_REDIRECT_URI_ANDROID ||
    !process.env.GITHUB_CLIENT_SECRET_ANDROID
  ) {
    throw new Error("Missing required environment variables");
  }

  return {
    jwtToken: {
      secret: process.env.JWT_TOKEN_SECRET,
      expiration: process.env.JWT_TOKEN_EXPIRATION,
    },

    github: {
      oauthEndpoint: process.env.GITHUB_OAUTH_ENDPOINT,
      apiEndpoint: process.env.GITHUB_API_ENDPOINT,
      web: {
        clientId: process.env.GITHUB_CLIENT_ID_WEB,
        redirectUri: process.env.GITHUB_REDIRECT_URI_WEB,
        clientSecret: process.env.GITHUB_CLIENT_SECRET_WEB,
      },
      android: {
        clientId: process.env.GITHUB_CLIENT_ID_ANDROID,
        redirectUri: process.env.GITHUB_REDIRECT_URI_ANDROID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET_ANDROID,
      },
    },
  };
};
