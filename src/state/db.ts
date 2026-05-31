import { deleteDB, openDB, type DBSchema, type IDBPDatabase, type OpenDBCallbacks } from "idb";

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

function DBCallbacks(): OpenDBCallbacks<DB> {
  return {
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
      console.warn("A new version of the database is available. Please refresh the page.");
    },
    blocked() {
      console.warn(
        "The database is currently open in another tab. Please close that tab and refresh this page.",
      );
    },
    terminated() {
      console.warn("The database connection was unexpectedly closed.");
    },
  };
}

export class RepoDB {
  static #instance: RepoDB;
  static #db: IDBPDatabase<DB> | null = null;

  static async init() {
    if (!RepoDB.#instance) {
      RepoDB.#instance = new RepoDB();
    }

    if (!RepoDB.#db) {
      RepoDB.#db = await openDB<DB>("cronus-db", 2, DBCallbacks());
    }
    return RepoDB.#instance;
  }

  private constructor() {}

  private get db() {
    if (!RepoDB.#db) {
      throw new Error("Database not initialized. Call RepoDB.init() first.");
    }
    return RepoDB.#db;
  }

  async addMessage(message: string) {
    const db = this.db;
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    await store.add({ id: Date.now(), message });
    await tx.done;
  }

  async getAllMessages() {
    const db = this.db;
    const tx = db.transaction("messages", "readonly");
    const store = tx.objectStore("messages");
    const messages = await store.getAll();
    await tx.done;
    return messages;
  }

  async clearMessages() {
    const db = this.db;
    const tx = db.transaction("messages", "readwrite");
    const store = tx.objectStore("messages");
    await store.clear();
    await tx.done;
  }

  async addJoinCode(joinCode: string) {
    const db = this.db;
    const tx = db.transaction("joinCodes", "readwrite");
    const store = tx.objectStore("joinCodes");
    await store.clear();
    await store.add({ id: Date.now(), joinCode });
    await tx.done;
  }

  async getJoinCode() {
    const db = this.db;
    const tx = db.transaction("joinCodes", "readonly");
    const store = tx.objectStore("joinCodes");
    const joinCodes = await store.getAll();
    await tx.done;
    return joinCodes[0];
  }

  async deleteDatabase() {
    await deleteDB("cronus-db");
  }
}
