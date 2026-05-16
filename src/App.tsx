import { useState } from "react";
import "./App.css";
import MessageInput from "./components/MessageInput/MessageInput";
import useMessageInput from "./components/MessageInput/useMessageInput";
import Message from "./components/Message/Message";

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const { value, rows, handleChange, handleKeyDown } = useMessageInput();

  const handleSendMessage = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessages((prevMessages) => [...prevMessages, value]);
      handleKeyDown(e);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {messages.map((message, index) => (
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
