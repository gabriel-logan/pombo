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
    apiEndpoint: string;
    web: {
      clientId: string;
      redirectUri: string;
      clientSecret: string;
    };
    android: {
      clientId: string;
      redirectUri: string;
      clientSecret: string;
    };
  };
}

export interface EnvTestConfig extends EnvGlobalConfig, EnvSecretConfig {}
