import { useContext } from "preact/hooks";
import { PeerContext } from "../context/PeerContext";
import type { UserMessage } from "../reducers/messageReducer";
import type { FilePayload } from "../utils/isUserMessage";

export const usePeer = () => {
  const context = useContext(PeerContext);

  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }

  return {
    connectToPeer: (peerId: string) => {
      context.connectToPeer(peerId);
    },
    sendMessage: (message: { text: string; files: FilePayload[] }) => {
      for (const connId in context.peer.connections) {
        const conn = context.peer.connections[connId];
        if (conn && conn.open) {
          conn.send(message);
        }
      }
    },
  };
};
