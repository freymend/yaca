import { useContext } from "react";
import { PeerContext } from "../context/PeerContext";

export const usePeer = () => {
  const context = useContext(PeerContext);

  if (!context) {
    throw new Error("usePeer must be used within a PeerProvider");
  }

  return {
    connectToPeer: (peerId: string) => {
      context.connectToPeer(peerId);
    },
    sendMessage: (message: string) => {
      for (const connId in context.peer.connections) {
        const conn = context.peer.connections[connId];
        if (conn && conn.open) {
          conn.send(message);
        }
      }
    },
  };
};
