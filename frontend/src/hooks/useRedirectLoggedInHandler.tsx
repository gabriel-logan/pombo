import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";

interface RedirectLoggedInHandlerProps {
  setIsLoading: (loading: boolean) => void;
}

export default function useRedirectLoggedInHandler({
  setIsLoading,
}: RedirectLoggedInHandlerProps) {
  const { isLoggedIn } = useAuthStore((state) => state);

  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.reset({ index: 0, routes: [{ name: "RootDrawerNavigator" }] });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigation, setIsLoading]);
}
