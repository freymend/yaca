import type { TargetedKeyboardEvent } from "preact";
import { useDB } from "../../hooks/useDB";
import useMessageStorage from "../../hooks/useMessageStorage";
import { usePeer } from "../../hooks/usePeer";
import { ActionType } from "../../reducers/messageReducer";
import styles from "./index.module.css";
import useMessageInput from "./useMessageInput";

export default function MessageInput() {
  const db = useDB();

  const { text, files, rows, fileInputRef, handleChange, handleFileChange, handleReset } = useMessageInput();
  const { dispatch } = useMessageStorage();
  const { sendMessage } = usePeer();

  const handleSendMessage = async (e: TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      db.addMessage({ text, files }).catch((error) => {
        console.error("Failed to add message to IndexedDB:", error);
      });
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: { id: Date.now(), message: text, files },
      });
      handleReset(e);

      const filePayloads = await Promise.all(
        Array.from(files).map(async (file) => ({
          name: file.name,
          type: file.type,
          data: await file.arrayBuffer(),
        }))
      );

      sendMessage({ text, files: filePayloads });
    }
  };

  return (
    <form className={styles.Form} id="MessageInput">
      <label className={styles.Label}>
        <textarea
          value={text}
          id="MessageInput"
          onChange={handleChange}
          onKeyDown={handleSendMessage}
          className={styles.Input}
          placeholder="Enter your message"
          autoComplete="off"
          rows={rows}
        />
      </label>
      <input ref={fileInputRef} id="MessageInputFiles" type="file" multiple onChange={handleFileChange}/>
    </form>
  );
}
