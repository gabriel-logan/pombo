import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage("check-alive")
  handleAlive(): { status: boolean } {
    return { status: true };
  }
}
