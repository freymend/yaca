import { useEffect, useReducer, useState } from "react";
import "./App.css";
import Message from "./components/Message/Message";
import MessageInput from "./components/MessageInput/MessageInput";
import useMessageInput from "./components/MessageInput/useMessageInput";
import { ActionType, messageReducer } from "./reducers/messageReducer";
import { addMessage, getAllMessages } from "./state/db";

function App() {
  const [messages, dispatch] = useReducer(messageReducer, []);
  const [isLoading, setIsLoading] = useState(true);

  const { value, rows, handleChange, handleKeyDown } = useMessageInput();

  useEffect(() => {
    let isMounted = true;

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
      isMounted = false;
    };
  }, []);

  const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Sending message:", value);
      addMessage(value).catch((error) => {
        console.error("Failed to add message to IndexedDB:", error);
      });
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: { id: Date.now().toString(), message: value },
      });
      handleKeyDown(e);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <div style={{ padding: "16px" }}>Loading messages...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map(({ message }, index) => (
          <Message key={index} message={message} />
        ))}
      </div>
      <MessageInput
        value={value}
        rows={rows}
        handleChange={handleChange}
        handleKeyDown={handleSendMessage}
      />
    </div>
  );
}

export default App;
