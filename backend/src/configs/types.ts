export interface EnvGlobalConfig {
  github: {
    oauthEndpoint: string;
    clientId: string;
    redirectUri: string;
    clientSecret: string;
  };
  server: {
    nodeEnv: "development" | "production" | "test";
    port: number;
  };
}
