import { useReducer } from "preact/hooks";
import { useDB } from "../hooks/useDB";
import { messageReducer } from "../reducers/messageReducer";
import { MessageStorageContext } from "./MessageStorageContext";

const MessageStorageProvider = ({ children }: { children: React.ReactNode }) => {
  const db = useDB();
  const [messages, dispatch] = useReducer(messageReducer, db.getMessages());

  return <MessageStorageContext value={{ messages, dispatch }}>{children}</MessageStorageContext>;
};

export default MessageStorageProvider;
