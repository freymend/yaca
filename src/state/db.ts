import { openDB, deleteDB } from "idb";

interface DB {
  messages: {
    id: number;
    message: string;
  };
}

const openRequest = await openDB<DB>("cronus-db", 1, {
  upgrade(db, oldVersion) {
    switch (oldVersion) {
      case 0:
        db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });
    }
  },
  blocking() {
    console.warn(
      "A new version of the database is available. Please refresh the page.",
    );
  },
  blocked() {
    console.warn(
      "The database is currently open in another tab. Please close that tab and refresh this page.",
    );
  },
  terminated() {
    console.warn("The database connection was unexpectedly closed.");
  },
});

export const db = openRequest;

export const addMessage = async (message: string) => {
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");
  await store.add({ message });
  await tx.done;
};

export const getAllMessages = async () => {
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const messages: { id: number; message: string }[] = await store.getAll();
  await tx.done;
  return messages;
};

export const clearMessages = async () => {
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");
  await store.clear();
  await tx.done;
};

export const deleteDatabase = async () => {
  await deleteDB("cronus-db");
};
