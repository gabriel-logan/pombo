import { Platform } from "react-native";
import * as SQLite from "expo-sqlite";

const chatDBKey = "chat-db";

let db: SQLite.SQLiteDatabase | null = null;
let idb: IDBDatabase | null = null;

export interface Message {
  id: number;
  roomId: string;
  text: string;
  sender: string;
  createdAt: number;
}

export async function initDB() {
  if (Platform.OS === "web") {
    return new Promise<void>((resolve, reject) => {
      const request = window.indexedDB.open(chatDBKey, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("messages")) {
          const store = db.createObjectStore("messages", {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("roomId", "roomId", { unique: false });
        }
      };

      request.onsuccess = () => {
        idb = request.result;
        resolve();
      };

      request.onerror = () => {
        reject(new Error(request.error?.message || "IndexedDB init failed"));
      };
    });
  } else {
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
}

export async function saveMessage(
  roomId: string,
  text: string,
  sender: string,
) {
  const createdAt = Date.now();

  if (Platform.OS === "web") {
    if (!idb) throw new Error("IndexedDB not initialized");

    return new Promise<void>((resolve, reject) => {
      const tx = idb!.transaction("messages", "readwrite");
      tx.objectStore("messages").add({ roomId, text, sender, createdAt });

      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(new Error(tx.error?.message || "Failed to save message"));
    });
  } else {
    if (!db) throw new Error("SQLite not initialized");
    await db.runAsync(
      "INSERT INTO messages (roomId, text, sender, createdAt) VALUES (?, ?, ?, ?)",
      [roomId, text, sender, createdAt],
    );
  }
}

export async function loadMessages(roomId: string): Promise<Message[]> {
  if (Platform.OS === "web") {
    if (!idb) throw new Error("IndexedDB not initialized");

    return new Promise<Message[]>((resolve, reject) => {
      const tx = idb!.transaction("messages", "readonly");
      const index = tx.objectStore("messages").index("roomId");
      const request = index.getAll(roomId);

      request.onsuccess = () => {
        resolve(request.result as Message[]);
      };
      request.onerror = () => {
        reject(new Error(request.error?.message || "Failed to load messages"));
      };
    });
  } else {
    if (!db) throw new Error("SQLite not initialized");
    return (
      (await db.getAllAsync<Message>(
        "SELECT * FROM messages WHERE roomId = ? ORDER BY createdAt ASC",
        [roomId],
      )) ?? []
    );
  }
}
