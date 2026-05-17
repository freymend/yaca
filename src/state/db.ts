import { openDB, deleteDB, type DBSchema } from "idb";

interface DB extends DBSchema {
  messages: {
    key: number;
    value: {
      id: number;
      message: string;
    };
  };
  joinCodes: {
    key: number;
    value: {
      id: number;
      joinCode: string;
    };
  };
}

export const db = await openDB<DB>("cronus-db", 2, {
  upgrade(db, oldVersion) {
    switch (oldVersion) {
      case 0:
        db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });
      case 1:
        db.createObjectStore("joinCodes", {
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

export const addMessage = async (message: string) => {
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");
  await store.add({ id: Date.now(), message });
  await tx.done;
};

export const getAllMessages = async () => {
  const tx = db.transaction("messages", "readonly");
  const store = tx.objectStore("messages");
  const messages = await store.getAll();
  await tx.done;
  return messages;
};

export const clearMessages = async () => {
  const tx = db.transaction("messages", "readwrite");
  const store = tx.objectStore("messages");
  await store.clear();
  await tx.done;
};

export const addJoinCode = async (joinCode: string) => {
  const tx = db.transaction("joinCodes", "readwrite");
  const store = tx.objectStore("joinCodes");
  await store.clear();
  await store.add({ id: Date.now(), joinCode });
  await tx.done;
};

export const getJoinCode = async () => {
  const tx = db.transaction("joinCodes", "readonly");
  const store = tx.objectStore("joinCodes");
  const joinCodes = await store.getAll();
  await tx.done;
  return joinCodes[0];
};

export const deleteDatabase = async () => {
  await deleteDB("cronus-db");
};
