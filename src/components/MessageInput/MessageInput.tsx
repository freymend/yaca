import styles from "./index.module.css";

interface MessageInputProps {
  value: string;
  rows: number;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function MessageInput({
  value,
  rows,
  handleChange,
  handleKeyDown,
}: MessageInputProps) {
  return (
    <form className={styles.Form} id="MessageInput">
      <label className={styles.Label}>
        Message
        <textarea
          id="MessageInput"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={styles.Input}
          placeholder="Enter your message"
          autoComplete="off"
          rows={rows}
        />
      </label>
    </form>
  );
}
