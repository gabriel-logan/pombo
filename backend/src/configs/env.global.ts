import type { EnvGlobalConfig } from "./types";

export default (): EnvGlobalConfig => {
  if (
    !process.env.GITHUB_OAUTH_ENDPOINT ||
    !process.env.GITHUB_CLIENT_ID ||
    !process.env.GITHUB_REDIRECT_URI ||
    !process.env.GITHUB_CLIENT_SECRET ||
    !process.env.SERVER_PORT ||
    !process.env.NODE_ENV
  ) {
    throw new Error("Missing required environment variables");
  }

  if (
    process.env.NODE_ENV !== "development" &&
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    throw new Error("Invalid NODE_ENV");
  }

  return {
    github: {
      oauthEndpoint: process.env.GITHUB_OAUTH_ENDPOINT,
      clientId: process.env.GITHUB_CLIENT_ID,
      redirectUri: process.env.GITHUB_REDIRECT_URI,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    server: {
      nodeEnv: process.env.NODE_ENV,
      port: parseInt(process.env.SERVER_PORT, 10),
    },
  };
};
