import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import { useAuthStore } from "../stores/authStore";

interface RedirectLoggedInHandlerProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function useRedirectLoggedInHandler({
  setIsLoading,
}: RedirectLoggedInHandlerProps) {
  const { isLoggedIn } = useAuthStore();

  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.reset({ index: 0, routes: [{ name: "RootDrawerNavigator" }] });
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, navigation, setIsLoading]);
}
