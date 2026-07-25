interface MessageProps {
  message: string;
}

export default function Message({ message }: MessageProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <p>{message}</p>
    </div>
  );
}
