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
        height: "100%",
        gridTemplateColumns: "1fr 2fr",
      }}
    >
      <Join />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          gap: "16px",
          paddingLeft: "8px",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "80ch" }}>
            {messages.map(({ message }, index) => (
              <Message key={index} message={message} />
            ))}
          </div>
        </div>
        <MessageInput />
      </div>
    </div>
  );
}

export default App;
