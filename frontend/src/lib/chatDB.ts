import * as SQLite from "expo-sqlite";

import type { Message, MessageWithoutID } from "../types/ChatDB";
import { chatDBKey } from "../utils/constants";

let db: SQLite.SQLiteDatabase | null = null;

export async function initDB() {
  db = await SQLite.openDatabaseAsync(chatDBKey);

  await db.execAsync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomId TEXT NOT NULL,
        text TEXT NOT NULL,
        sender TEXT NOT NULL,
        createdAt INTEGER NOT NULL
      );
    `);
}

export async function saveMessage(message: MessageWithoutID): Promise<Message> {
  if (!db) throw new Error("SQLite not initialized");

  const { roomId, text, sender, clientMsgId, status, createdAt } = message;

  const result = await db.runAsync(
    "INSERT INTO messages (roomId, text, sender, clientMsgId, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
    [roomId, text, sender, clientMsgId, status, createdAt],
  );

  return {
    id: result.lastInsertRowId,
    ...message,
  };
}

export async function loadMessages({
  roomId,
}: {
  roomId: string;
}): Promise<Message[]> {
  if (!db) throw new Error("SQLite not initialized");

  return (
    (await db.getAllAsync<Message>(
      "SELECT * FROM messages WHERE roomId = ? ORDER BY createdAt ASC",
      [roomId],
    )) ?? []
  );
}

export async function deleteMessage({ clientMsgId }: { clientMsgId: string }) {
  if (!db) throw new Error("SQLite not initialized");

  await db.runAsync("DELETE FROM messages WHERE clientMsgId = ?", [
    clientMsgId,
  ]);
}

export async function deleteChat({ roomId }: { roomId: string }) {
  if (!db) throw new Error("SQLite not initialized");

  await db.runAsync("DELETE FROM messages WHERE roomId = ?", [roomId]);
}
