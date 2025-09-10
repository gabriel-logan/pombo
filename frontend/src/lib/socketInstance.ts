import { io } from "socket.io-client";

import { useAuthStore } from "../stores/authStore";
import { apiPublic } from "../utils/env/api";

const socket = io(apiPublic.serverApiBaseUrl, {
  auth: {
    token: useAuthStore.token,
  },
});

export default socket;
