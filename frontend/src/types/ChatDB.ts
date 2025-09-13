export interface Message {
  id: number;
  roomId: string;
  text: string;
  sender: "me" | "other";
  createdAt: number;
  clientMsgId: string;
}

export type MessageWithoutID = Omit<Message, "id">;
