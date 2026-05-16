import { addMessage, clearMessages } from "../state/db";

interface Message {
  id: string;
  message: string;
}

interface AddMessageAction {
  type: ActionType.ADD_MESSAGE;
  payload: Message;
}

interface InitializeMessagesAction {
  type: ActionType.INITIALIZE_MESSAGES;
  payload: Message[];
}

interface ClearMessagesAction {
  type: ActionType.CLEAR_MESSAGES;
}

type ReducerAction =
  | AddMessageAction
  | InitializeMessagesAction
  | ClearMessagesAction;

export const enum ActionType {
  INITIALIZE_MESSAGES = "INITIALIZE_MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
  CLEAR_MESSAGES = "CLEAR_MESSAGES",
}

export function messageReducer(
  state: Message[],
  action: ReducerAction,
): Message[] {
  switch (action.type) {
    case ActionType.INITIALIZE_MESSAGES:
      return action.payload;
    case ActionType.ADD_MESSAGE:
      return [...state, action.payload];
    case ActionType.CLEAR_MESSAGES:
      clearMessages().catch((error) => {
        console.error("Failed to clear messages from IndexedDB:", error);
      });
      return [];
    default:
      return state;
  }
}
