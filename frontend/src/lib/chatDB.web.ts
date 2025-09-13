import type { Message } from "../types/ChatDB";
import { chatDBKey } from "../utils/constants";

let idb: IDBDatabase | null = null;

export async function initDB() {
  return await new Promise<void>((resolve, reject) => {
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
}

export async function saveMessage(
  roomId: string,
  text: string,
  sender: string,
) {
  if (!idb) throw new Error("IndexedDB not initialized");

  const createdAt = Date.now();

  return await new Promise<void>((resolve, reject) => {
    const tx = idb!.transaction("messages", "readwrite");

    tx.objectStore("messages").add({ roomId, text, sender, createdAt });

    tx.oncomplete = () => resolve();

    tx.onerror = () =>
      reject(new Error(tx.error?.message || "Failed to save message"));
  });
}

export async function loadMessages(roomId: string): Promise<Message[]> {
  if (!idb) throw new Error("IndexedDB not initialized");

  return await new Promise<Message[]>((resolve, reject) => {
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
}

export async function deleteMessage(messageId: number) {
  if (!idb) throw new Error("IndexedDB not initialized");

  return await new Promise<void>((resolve, reject) => {
    const tx = idb!.transaction("messages", "readwrite");

    tx.objectStore("messages").delete(messageId);

    tx.oncomplete = () => resolve();

    tx.onerror = () =>
      reject(new Error(tx.error?.message || "Failed to delete message"));
  });
}

export async function deleteChat(roomId: string) {
  if (!idb) throw new Error("IndexedDB not initialized");

  return await new Promise<void>((resolve, reject) => {
    const tx = idb!.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    const index = store.index("roomId");
    const request = index.getAllKeys(roomId);

    request.onsuccess = () => {
      const keys = request.result;
      keys.forEach((key) => store.delete(key));
    };

    tx.oncomplete = () => resolve();

    tx.onerror = () =>
      reject(new Error(tx.error?.message || "Failed to delete chat"));
  });
}
