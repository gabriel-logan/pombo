import { Logger, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { WSAuthGuard } from "src/auth/guards/ws-auth.guard";
import { Public } from "src/common/decorators/routes/public.decorator";

@UseGuards(WSAuthGuard)
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  private validateClientRoom(clientId: string, room: string): boolean {
    const ids = room.split("_");

    if (ids.length !== 2) {
      throw new WsException("Invalid room format");
    }

    const id1 = ids[0];
    const id2 = ids[1];

    return id1 === clientId || id2 === clientId;
  }

  @WebSocketServer()
  private readonly server: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @Public()
  @SubscribeMessage("check-alive")
  handleAlive(): { status: boolean } {
    return { status: true };
  }

  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const isValidClientRoom = this.validateClientRoom(client.user!.sub, room);

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to join this room");
    }

    await client.join(room);
  }

  @SubscribeMessage("leave-room")
  async handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const isValidClientRoom = this.validateClientRoom(client.user!.sub, room);

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to leave this room");
    }

    await client.leave(room);
  }

  @SubscribeMessage("send-message")
  handleMessage(
    @MessageBody() data: { room: string; message: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room, message } = data;

    const senderId = client.user!.sub;

    const isValidClientRoom = this.validateClientRoom(senderId, room);

    if (!isValidClientRoom) {
      throw new WsException(
        "You are not allowed to send messages in this room",
      );
    }

    this.server.to(room).emit("new-message", {
      message,
      senderId: parseInt(senderId, 10),
    });
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room } = data;

    const senderId = client.user!.sub;

    const isValidClientRoom = this.validateClientRoom(senderId, room);

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to type in this room");
    }

    this.server.to(room).emit("user-typing", {
      senderId: parseInt(senderId, 10),
    });
  }

  @SubscribeMessage("stop-typing")
  handleStopTyping(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room } = data;

    const senderId = client.user!.sub;

    const isValidClientRoom = this.validateClientRoom(senderId, room);

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to stop typing in this room");
    }

    this.server.to(room).emit("user-stop-typing", {
      senderId: parseInt(senderId, 10),
    });
  }
}
