import Peer from "peerjs"
import { useEffect, useRef, useState } from "react";

export const usePeer = (id: string | null) => {
  const peerRef = useRef<Peer | null>(null);
  const connectionIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!id) return;

    const peer = new Peer(id);

    peerRef.current = peer;

    peerRef.current.on("open", (id) => {
      console.log(`Peer connected with ID: ${id}`);
    });

    peerRef.current.on("connection", (conn) => {
      console.log(`Connected to peer: ${conn.peer}`);
    });
  
    peerRef.current.on("error", (err) => {
      console.error("Peer error:", err);
    });

    return () => {
      peer.destroy();
      peerRef.current = null;
    };
  }, [id]);

  return {
    peer: peerRef.current,
    connectToPeer: (peerId: string) => {
      if (peerRef.current && !connectionIdsRef.current.has(peerId)) {
        const connection = peerRef.current.connect(peerId);
        if (connection) {
          connection.on("open", () => {
            console.log(`Connection established with peer: ${peerId}`);
            connectionIdsRef.current.add(peerId);
          });
          connection.on("close", () => {
            console.log(`Connection closed with peer: ${peerId}`);
            connectionIdsRef.current.delete(peerId);
          });
        }
        return
      }
      return null;
    },
  }
}