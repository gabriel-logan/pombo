export interface Message {
  id: number;
  roomId: string;
  text: string;
  sender: string;
  createdAt: number;
  clientMsgId: string;
}
