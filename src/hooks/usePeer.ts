import { useContext } from "react";
import { PeerContext } from "../context/PeerContext";

export const usePeer = () => {
  const peer = useContext(PeerContext);

  if (!peer) {
    throw new Error("usePeer must be used within a PeerProvider");
  }

  return {
    connectToPeer: (peerId: string) => {
      peer.connectToPeer(peerId);
    },
  };
};
