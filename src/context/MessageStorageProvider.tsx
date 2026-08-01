import { memo, type ReactNode } from "preact/compat";
import { useReducer } from "preact/hooks";
import { useDB } from "../hooks/useDB";
import { messageReducer, ActionType, type ReducerAction } from "../reducers/messageReducer";
import { MessageStorageContext } from "./MessageStorageContext";

const MessageStorageProvider = ({ children }: { children: ReactNode }) => {
  const db = useDB();
  const [messages, dispatch] = useReducer(messageReducer, db.getMessages());

  const dispatchWithDb = (action: ReducerAction) => {
    if (action.type === ActionType.ADD_MESSAGE) {
      db.addMessage({ text: action.payload.message, files: action.payload.files });
    }
    dispatch(action);
  };

  return (
    <MessageStorageContext value={{ messages, dispatch: dispatchWithDb }}>
      {children}
    </MessageStorageContext>
  );
};

export default memo(MessageStorageProvider);
