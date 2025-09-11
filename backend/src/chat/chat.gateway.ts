import { Logger, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
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
import { JwtPayload } from "src/common/types";
import { EnvSecretConfig } from "src/configs/types";

@UseGuards(WSAuthGuard)
@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  private readonly onlineUsers: Map<number, string> = new Map();

  private readonly offlineMessages: Map<
    string,
    Array<{
      senderId: number;
      message: string;
      timestamp: number;
    }>
  > = new Map();

  constructor(
    private readonly configService: ConfigService<EnvSecretConfig, true>,
    private readonly jwtService: JwtService,
  ) {}

  private async extractUserFromHandshakeToken(
    client: Socket,
  ): Promise<JwtPayload | null> {
    const token = client.handshake.auth.token as string | undefined;

    if (!token) {
      return null;
    }

    const { secret } =
      this.configService.get<EnvSecretConfig["jwtToken"]>("jwtToken");

    const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
      secret,
    });

    return payload;
  }

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

  async handleConnection(client: Socket): Promise<void> {
    const user = await this.extractUserFromHandshakeToken(client);

    this.logger.log(
      `Client connected: ${client.id}, User: ${JSON.stringify(user)}`,
    );

    if (user) {
      const userId = parseInt(user.sub, 10);

      this.onlineUsers.set(userId, client.id);

      this.server.emit("user-online", { userId });
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const user = await this.extractUserFromHandshakeToken(client);

    this.logger.log(
      `Client disconnected: ${client.id}, User: ${JSON.stringify(user)}`,
    );

    if (user) {
      const userId = parseInt(user.sub, 10);

      this.onlineUsers.delete(userId);

      this.server.emit("user-offline", { userId });
    }
  }

  @Public()
  @SubscribeMessage("check-alive")
  handleAlive(): { status: boolean } {
    return { status: true };
  }

  @SubscribeMessage("check-online-status")
  handleCheckOnlineStatus(@MessageBody() otherId: number): { online: boolean } {
    const isOnline = this.onlineUsers.has(otherId);

    return { online: isOnline };
  }

  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { sub: authenticatedClientId } = client.user!;

    const isValidClientRoom = this.validateClientRoom(
      authenticatedClientId,
      room,
    );

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to join this room");
    }

    await client.join(room);

    // Send any offline messages to the user upon joining the room
    const pendingMessages = this.offlineMessages.get(room) || [];

    pendingMessages.forEach((msg) => {
      client.emit("new-message", msg);
    });

    this.offlineMessages.delete(room);
  }

  @SubscribeMessage("leave-room")
  async handleLeaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { sub: authenticatedClientId } = client.user!;

    const isValidClientRoom = this.validateClientRoom(
      authenticatedClientId,
      room,
    );

    if (!isValidClientRoom) {
      throw new WsException("You are not allowed to leave this room");
    }

    await client.leave(room);
  }

  @SubscribeMessage("send-message")
  handleMessage(
    @MessageBody() data: { room: string; message: string; clientMsgId: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room, message, clientMsgId } = data;

    const { sub: authenticatedClientId } = client.user!;

    const isValidClientRoom = this.validateClientRoom(
      authenticatedClientId,
      room,
    );

    if (!isValidClientRoom) {
      throw new WsException(
        "You are not allowed to send messages in this room",
      );
    }

    const msgData = {
      clientMsgId,
      message,
      senderId: parseInt(authenticatedClientId, 10),
      timestamp: Date.now(),
    } as const;

    // Acknowledge to sender that message is sent
    client.emit("message-status", {
      clientMsgId,
      status: "sent",
    });

    const roomSockets = this.server.sockets.adapter.rooms.get(room);
    const connectedCount = roomSockets ? roomSockets.size : 0;

    if (connectedCount > 1) {
      this.server.to(room).emit("new-message", msgData);
    } else {
      // Store the message for offline delivery
      if (!this.offlineMessages.has(room)) {
        this.offlineMessages.set(room, []);
      }

      this.offlineMessages.get(room)!.push(msgData);
    }
  }

  @SubscribeMessage("message-delivered")
  handleMessageDelivered(@MessageBody() data: { clientMsgId: string }): void {
    const { clientMsgId } = data;

    // Notify sender that message is delivered
    this.server.emit("message-status", {
      clientMsgId,
      status: "delivered",
    });
  }

  @SubscribeMessage("message-read")
  handleMessageRead(@MessageBody() data: { clientMsgId: string }): void {
    const { clientMsgId } = data;

    // Notify sender that message is read
    this.server.emit("message-status", {
      clientMsgId,
      status: "read",
    });
  }

  @SubscribeMessage("typing")
  handleTyping(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room } = data;

    const { sub: authenticatedClientId } = client.user!;

    this.server.to(room).emit("user-typing", {
      senderId: parseInt(authenticatedClientId, 10),
    });
  }

  @SubscribeMessage("stop-typing")
  handleStopTyping(
    @MessageBody() data: { room: string },
    @ConnectedSocket() client: Socket,
  ): void {
    const { room } = data;

    const { sub: authenticatedClientId } = client.user!;

    this.server.to(room).emit("user-stop-typing", {
      senderId: parseInt(authenticatedClientId, 10),
    });
  }
}
