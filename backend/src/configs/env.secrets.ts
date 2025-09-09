import type { EnvSecretConfig } from "./types";

export default (): EnvSecretConfig => {
  if (
    !process.env.GITHUB_OAUTH_ENDPOINT ||
    !process.env.GITHUB_CLIENT_ID ||
    !process.env.GITHUB_REDIRECT_URI ||
    !process.env.GITHUB_CLIENT_SECRET ||
    !process.env.JWT_TOKEN_SECRET ||
    !process.env.JWT_TOKEN_EXPIRATION
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
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: process.env.GITHUB_REDIRECT_URI,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  };
};
