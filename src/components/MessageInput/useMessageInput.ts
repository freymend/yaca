import { useState } from "react";

export default function useMessageInput() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);

  const handleReset = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setValue("");
    setRows(1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const lineCount = e.target.value.split("\n").length;
    setRows(lineCount);
  };

  return {
    value,
    rows,
    handleChange,
    handleReset,
  };
}
