import { useReducer } from "preact/hooks";
import type { ReactNode } from "react-dom/src";
import { useDB } from "../hooks/useDB";
import { messageReducer } from "../reducers/messageReducer";
import { MessageStorageContext } from "./MessageStorageContext";

const MessageStorageProvider = ({ children }: { children: ReactNode }) => {
  const db = useDB();
  const [messages, dispatch] = useReducer(messageReducer, db.getMessages());

  return <MessageStorageContext value={{ messages, dispatch }}>{children}</MessageStorageContext>;
};

export default MessageStorageProvider;
