import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);

    console.log(client);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("check-alive")
  handleAlive(): { status: boolean } {
    return { status: true };
  }

  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.join(room);
  }

  @SubscribeMessage("leave-room")
  async handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    await client.leave(room);
  }

  @SubscribeMessage("send-message")
  handleMessage(
    @MessageBody() data: { room: string; message: string; senderId: number },
  ): void {
    const { room, message, senderId } = data;

    this.server.to(room).emit("new-message", {
      message,
      senderId,
    });
  }

  @SubscribeMessage("typing")
  handleTyping(@MessageBody() data: { room: string; senderId: number }): void {
    const { room, senderId } = data;

    this.server.to(room).emit("user-typing", {
      senderId,
    });
  }

  @SubscribeMessage("stop-typing")
  handleStopTyping(
    @MessageBody() data: { room: string; senderId: number },
  ): void {
    const { room, senderId } = data;

    this.server.to(room).emit("user-stop-typing", {
      senderId,
    });
  }
}
