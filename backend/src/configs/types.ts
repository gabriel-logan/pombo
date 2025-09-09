export interface EnvGlobalConfig {
  server: {
    nodeEnv: "development" | "production" | "test";
    port: number;
  };
}

export interface EnvSecretConfig {
  jwtToken: {
    secret: string;
    expiration: string;
  };

  github: {
    oauthEndpoint: string;
    clientId: string;
    redirectUri: string;
    clientSecret: string;
  };
}

export interface EnvTestConfig extends EnvGlobalConfig, EnvSecretConfig {}
