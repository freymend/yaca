interface MessageProps {
  message: string;
  files: File[];
}

export default function Message({ message, files }: MessageProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
      }}
    >
      <p>{message}</p>
      {files.length > 0 && (
        <div style={{ display: "flex", flexDirection: "row", gap: "4px" }}>
          {files.map((file, index) => (
            <div key={index}>
              <a href={URL.createObjectURL(file)} download={file.name}>
                {file.name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
