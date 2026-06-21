import "./App.css";
import Join from "./components/Join/Join";
import Message from "./components/Message/Message";
import MessageInput from "./components/MessageInput/MessageInput";
import useMessageStorage from "./hooks/useMessageStorage";

function App() {
  const { messages } = useMessageStorage();

  return (
    <div
      style={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "repeat(3, 1fr)",
      }}
    >
      <Join />
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
        <MessageInput />
      </div>
    </div>
  );
}

export default App;
