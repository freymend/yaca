import type { TargetedKeyboardEvent } from "preact";
import { useRef } from "preact/hooks";
import { useJoinCode } from "../../hooks/useJoinCode";
import { usePeer } from "../../hooks/usePeer";

export default function Join() {
  const { connectToPeer } = usePeer();

  const { data: joinCode } = useJoinCode();

  const ref = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: TargetedKeyboardEvent<HTMLInputElement>) => {
    const inputValue = ref.current?.value.trim();
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      connectToPeer(inputValue);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        padding: "16px",
        alignItems: "flex-start",
      }}
    >
      <p style={{ fontWeight: 500 }}>Join Code</p>
      <p>{joinCode}</p>
      <input
        ref={ref}
        type="text"
        name="joinCode"
        placeholder="Enter join code"
        autoComplete="off"
        onKeyDown={handleKeyDown}
        style={{
          padding: "8px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          width: "100%",
          height: "40px",
          boxSizing: "border-box",
          fontSize: "16px",
        }}
      />
    </div>
  );
}
