import { io } from "socket.io-client";

import { apiPublic } from "../utils/env/api";

const socket = io(apiPublic.serverApiBaseUrl);

export default socket;
