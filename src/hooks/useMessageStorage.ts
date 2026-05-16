import { useEffect, useReducer, useState } from "react";
import { ActionType, messageReducer } from "../reducers/messageReducer";
import { getAllMessages } from "../state/db";

export default function useMessageStorage() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, dispatch] = useReducer(messageReducer, []);

  useEffect(() => {
    let _isMounted = true;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const messages = await getAllMessages();
        dispatch({
          type: ActionType.INITIALIZE_MESSAGES,
          payload: messages.map((msg) => ({
            id: msg.id.toString(),
            message: msg.message,
          })),
        });
      } catch (error) {
        console.error("Failed to fetch messages from IndexedDB:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();

    return () => {
      _isMounted = false;
    };
  }, []);

  return { messages, isLoading, dispatch };
}
