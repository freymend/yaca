import { useContext } from "react";
import { MessageStorageContext } from "../context/MessageStorageContext";

export default function useMessageStorage() {
  const messageStorage = useContext(MessageStorageContext);

  if (!messageStorage) {
    throw new Error("useMessageStorage must be used within a MessageStorageProvider");
  }

  return messageStorage;
}
