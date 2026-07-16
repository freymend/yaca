import { useDB } from "../../hooks/useDB";
import useMessageStorage from "../../hooks/useMessageStorage";
import { usePeer } from "../../hooks/usePeer";
import { ActionType } from "../../reducers/messageReducer";
import styles from "./index.module.css";
import useMessageInput from "./useMessageInput";

export default function MessageInput() {
  const db = useDB();

  const { value, rows, handleChange, handleReset } = useMessageInput();
  const { dispatch } = useMessageStorage();
  const { sendMessage } = usePeer();

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
      handleReset(e);
      sendMessage(value);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <form className={styles.Form} id="MessageInput">
      <label className={styles.Label}>
        Message
        <textarea
          id="MessageInput"
          value={value}
          onChange={handleChange}
          onKeyDown={handleSendMessage}
          className={styles.Input}
          placeholder="Enter your message"
          autoComplete="off"
          rows={rows}
        />
      </label>
    </form>
  );
}
