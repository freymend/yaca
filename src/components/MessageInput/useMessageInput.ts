import type { TargetedKeyboardEvent } from "preact";
import { useState } from "preact/hooks";

export default function useMessageInput() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);

  const handleReset = (e: TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setValue("");
    setRows(1);
  };

  const handleChange = (e: TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    setValue(e.currentTarget.value);
    const lineCount = e.currentTarget.value.split("\n").length;
    setRows(lineCount);
  };

  return {
    value,
    rows,
    handleChange,
    handleReset,
  };
}
