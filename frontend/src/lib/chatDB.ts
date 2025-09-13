import * as SQLite from "expo-sqlite";

import { chatDBKey } from "../utils/constants";

let db: SQLite.SQLiteDatabase | null = null;

export interface Message {
  id: number;
  roomId: string;
  text: string;
  sender: string;
  createdAt: number;
  clientMsgId: string;
}

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

export async function saveMessage(
  roomId: string,
  text: string,
  sender: string,
) {
  const createdAt = Date.now();

  if (!db) throw new Error("SQLite not initialized");

  await db.runAsync(
    "INSERT INTO messages (roomId, text, sender, createdAt) VALUES (?, ?, ?, ?)",
    [roomId, text, sender, createdAt],
  );
}

export async function loadMessages(roomId: string): Promise<Message[]> {
  if (!db) throw new Error("SQLite not initialized");

  return (
    (await db.getAllAsync<Message>(
      "SELECT * FROM messages WHERE roomId = ? ORDER BY createdAt ASC",
      [roomId],
    )) ?? []
  );
}

export async function deleteMessage(messageId: number) {
  if (!db) throw new Error("SQLite not initialized");

  await db.runAsync("DELETE FROM messages WHERE id = ?", [messageId]);
}

export async function deleteChat(roomId: string) {
  if (!db) throw new Error("SQLite not initialized");

  await db.runAsync("DELETE FROM messages WHERE roomId = ?", [roomId]);
}
