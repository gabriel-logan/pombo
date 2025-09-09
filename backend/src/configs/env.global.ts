import type { EnvGlobalConfig } from "./types";

export default (): EnvGlobalConfig => {
  if (!process.env.SERVER_PORT || !process.env.NODE_ENV) {
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
    server: {
      nodeEnv: process.env.NODE_ENV,
      port: parseInt(process.env.SERVER_PORT, 10),
    },
  };
};
