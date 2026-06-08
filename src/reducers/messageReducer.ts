export interface Message {
  id: number;
  message: string;
}

export interface AddMessageAction {
  type: ActionType.ADD_MESSAGE;
  payload: Message;
}

export interface InitializeMessagesAction {
  type: ActionType.INITIALIZE_MESSAGES;
  payload: Message[];
}

export interface ClearMessagesAction {
  type: ActionType.CLEAR_MESSAGES;
}

export type ReducerAction = AddMessageAction | InitializeMessagesAction | ClearMessagesAction;

export const enum ActionType {
  INITIALIZE_MESSAGES = "INITIALIZE_MESSAGES",
  ADD_MESSAGE = "ADD_MESSAGE",
  CLEAR_MESSAGES = "CLEAR_MESSAGES",
}

export function messageReducer(state: Message[], action: ReducerAction): Message[] {
  switch (action.type) {
    case ActionType.INITIALIZE_MESSAGES:
      return action.payload;
    case ActionType.ADD_MESSAGE:
      return [...state, action.payload];
    case ActionType.CLEAR_MESSAGES:
      return [];
    default:
      return state;
  }
}
