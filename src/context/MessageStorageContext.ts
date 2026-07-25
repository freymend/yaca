import { createContext } from "preact";
import type { Message, ReducerAction } from "../reducers/messageReducer";
import type { Dispatch } from "preact/hooks";

export interface MessageStorageContextValue {
  messages: Message[];
  dispatch: Dispatch<ReducerAction>;
}

export const MessageStorageContext = createContext<MessageStorageContextValue | null>(null);
