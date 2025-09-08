import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

import { CheckChatDto } from "./dto/check-chat.dto";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway {
  @SubscribeMessage("chat-alive")
  handleIsAlive(): CheckChatDto {
    return { status: true };
  }
}
