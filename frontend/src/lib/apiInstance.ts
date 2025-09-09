import axios from "axios";

import { apiPublic } from "../utils/env/api";

const apiInstance = axios.create({
  baseURL: apiPublic.serverApiBaseUrl,
});

export default apiInstance;
