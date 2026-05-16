import "./App.css";
import Message from "./components/Message/Message";
import MessageInput from "./components/MessageInput/MessageInput";
import useMessageInput from "./components/MessageInput/useMessageInput";
import useMessageStorage from "./hooks/useMessageStorage";
import { ActionType } from "./reducers/messageReducer";
import { addMessage } from "./state/db";

function App() {
  const { messages, isLoading, dispatch } = useMessageStorage();
  const { value, rows, handleChange, handleKeyDown } = useMessageInput();

  const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
