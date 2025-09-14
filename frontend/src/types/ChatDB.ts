export interface Message {
  id: number;
  roomId: string;
  text: string;
  sender: "me" | "other";
  createdAt: number;
  clientMsgId: string;
  status: "pending" | "sent" | "delivered" | "read" | "failed";
}

export type MessageWithoutID = Omit<Message, "id">;
