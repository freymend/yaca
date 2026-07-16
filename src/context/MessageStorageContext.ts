import { createContext } from "preact";
import type { Message, ReducerAction } from "../reducers/messageReducer";

export interface MessageStorageContextValue {
  messages: Message[];
  dispatch: React.ActionDispatch<[action: ReducerAction]>;
}

export const MessageStorageContext = createContext<MessageStorageContextValue | null>(null);
