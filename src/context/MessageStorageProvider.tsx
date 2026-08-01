import { memo, type ReactNode } from "preact/compat";
import { useCallback, useReducer } from "preact/hooks";
import { useDB } from "../hooks/useDB";
import { messageReducer, ActionType, type ReducerAction } from "../reducers/messageReducer";
import { MessageStorageContext } from "./MessageStorageContext";

const MessageStorageProvider = ({ children }: { children: ReactNode }) => {
  const db = useDB();
  const [messages, dispatch] = useReducer(messageReducer, db.getMessages());

  // We need to wrap the dispatch function in a useCallback to ensure that it's reference doesn't change, forcing the useEffect in the PeerProvider
  // breaking the connection to the peer. TODO: refactor PeerProvider initialization to live outside of the React lifecycle.
  const dispatchWithDb = useCallback(
    (action: ReducerAction) => {
      if (action.type === ActionType.ADD_MESSAGE) {
        db.addMessage({ text: action.payload.message, files: action.payload.files });
      }
      dispatch(action);
    },
    [dispatch, db],
  );

  return (
    <MessageStorageContext value={{ messages, dispatch: dispatchWithDb }}>
      {children}
    </MessageStorageContext>
  );
};

export default memo(MessageStorageProvider);
