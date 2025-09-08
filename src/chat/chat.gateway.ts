import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @SubscribeMessage("is-alive")
  handleIsAlive(): {
    status: boolean;
  } {
    return { status: true };
  }
}
