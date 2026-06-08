import "./App.css";
import Join from "./components/Join/Join";
import Message from "./components/Message/Message";
import MessageInput from "./components/MessageInput/MessageInput";
import useMessageInput from "./components/MessageInput/useMessageInput";
import { useDB } from "./hooks/useDB";
import useMessageStorage from "./hooks/useMessageStorage";
import { usePeer } from "./hooks/usePeer";
import { ActionType } from "./reducers/messageReducer";

function App() {
  const db = useDB();
  const { messages, dispatch } = useMessageStorage();
  const { connectToPeer } = usePeer();
  const { value, rows, handleChange, handleKeyDown } = useMessageInput();

  const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      db.addMessage(value).catch((error) => {
        console.error("Failed to add message to IndexedDB:", error);
      });
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: { id: Date.now(), message: value },
      });
      handleKeyDown(e);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      <Join connectToPeer={connectToPeer} />
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          minWidth: "80ch",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
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
    </div>
  );
}

export default App;
