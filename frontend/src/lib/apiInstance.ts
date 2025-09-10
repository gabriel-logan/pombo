import axios from "axios";

import { useAuthStore } from "../stores/authStore";
import { apiPublic } from "../utils/env/api";

const apiInstance = axios.create({
  baseURL: apiPublic.serverApiBaseUrl,
});

apiInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiInstance;
