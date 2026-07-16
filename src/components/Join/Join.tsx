import { useSuspenseQuery } from "@tanstack/react-query";
import { useRef } from "preact/hooks";
import { useDB } from "../../hooks/useDB";
import { usePeer } from "../../hooks/usePeer";

export default function Join() {
  const db = useDB();
  const { connectToPeer } = usePeer();

  const { data: joinCode } = useSuspenseQuery({
    queryKey: ["joinCode"],
    queryFn: async () => {
      const joinCodeData = await db.getJoinCode();
      return joinCodeData.joinCode;
    },
  });

  const ref = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputValue = ref.current?.value.trim();
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      connectToPeer(inputValue);
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        width: "400px",
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
