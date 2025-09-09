const serverApiBaseUrl: string | undefined =
  process.env.EXPO_PUBLIC_SERVER_API_BASE_URL;

if (!serverApiBaseUrl) {
  throw new Error("Server API environment variable is not set properly.");
}

export const apiPublic = {
  serverApiBaseUrl,
};
