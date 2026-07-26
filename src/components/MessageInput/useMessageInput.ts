import type { TargetedKeyboardEvent } from "preact";
import { useRef, useState } from "preact/hooks";

export default function useMessageInput() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [rows, setRows] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = (e: TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setText("");
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setRows(1);
  };

  const handleChange = (e: TargetedKeyboardEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
    const lineCount = e.currentTarget.value.split("\n").length;
    setRows(lineCount);
  };

  const handleFileChange = (e: TargetedKeyboardEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : [];
    setFiles(files);
  };

  return {
    text,
    files,
    rows,
    fileInputRef,
    handleChange,
    handleFileChange,
    handleReset,
  };
}
