import type { UserMessage } from "../reducers/messageReducer";

export interface FilePayload {
  name: string;
  type: string;
  data: ArrayBuffer;
}

// Add this helper in src/state/peer.ts or a separate validation file
export function isValidMessage(data: unknown): data is { text: string; files: FilePayload[] } {
  return typeof data === "object" && data !== null && "text" in data && "files" in data;
}

export function convertToUserMessage(data: { text: string; files: FilePayload[] }): UserMessage {
  return {
    text: data.text,
    files: data.files.map((file) => new File([file.data], file.name, { type: file.type })),
  };
}

