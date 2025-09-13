import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import * as Linking from "expo-linking";

import apiInstance from "../lib/apiInstance";
import { useAuthStore } from "../stores/authStore";
import type { AuthUser } from "../types/Auth";

interface OAuthHandlerProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useOAuthHandler({ setIsLoading }: OAuthHandlerProps) {
  const { signIn, signOut } = useAuthStore();

  const [params, setParams] = useState<Linking.QueryParams | null>(null);

  const consumedRef = useRef(false); // To prevent multiple consumptions of the same (QUERY) code

  // Handle the OAuth redirect URL and extract the code
  useEffect(() => {
    function handleUrlString(url?: string | null) {
      if (!url) return;

      const parsed = Linking.parse(url);

      const code = parsed.queryParams?.code;

      if (code && !consumedRef.current) {
        consumedRef.current = true;

        setParams(parsed.queryParams);
      }
    }

    Linking.getInitialURL().then(handleUrlString);

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrlString(url);
    });

    return () => subscription.remove();
  }, []);

  // When we have a code, exchange it for a token and sign in
  useEffect(() => {
    if (params?.code) {
      setIsLoading(true);

      async function getUser() {
        try {
          const response = await apiInstance.post<AuthUser>(
            "/auth/github/sign-in",
            {
              code: params?.code,
              platformOS: Platform.OS,
            },
          );

          console.log(response.data);

          // Save the token in local storage
          await signIn(response.data);
        } catch {
          await signOut();

          consumedRef.current = false;
        } finally {
          // Clean up the URL parameters
          setParams(null);

          // Clean the URL in web environment
          if (
            Platform.OS === "web" &&
            typeof window !== "undefined" &&
            window.history?.replaceState
          ) {
            const clean = window.location.origin + window.location.pathname;
            window.history.replaceState({}, document.title, clean);
          }

          setIsLoading(false);
        }
      }

      getUser();
    }
  }, [params?.code, setIsLoading, signIn, signOut]);
}
