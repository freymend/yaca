import { useSuspenseQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef } from "react";
import { useDB } from "../hooks/useDB";
import useMessageStorage from "../hooks/useMessageStorage";
import { ActionType } from "../reducers/messageReducer";
import { PeerJS } from "../state/peer";
import { PeerContext } from "./PeerContext";

type PeerProviderProps = {
  children: ReactNode;
};

export const PeerProvider = ({ children }: PeerProviderProps) => {
  const db = useDB();
  const { dispatch } = useMessageStorage();

  const { data: joinCode } = useSuspenseQuery({
    queryKey: ["joinCode"],
    queryFn: async () => {
      const joinCodeData = await db.getJoinCode();
      return joinCodeData.joinCode;
    },
  });

  const peerRef = useRef<PeerJS>(new PeerJS());

  useEffect(() => {
    const peer = peerRef.current;

    peer.initialize(joinCode);

    peer.onopen((id) => {
      console.log(`Peer connected with ID: ${id}`);
    });

    peer.onconnection((conn) => {
      console.log(`Connected to peer: ${conn.peer}`);
      conn.on("data", (data) => {
        console.log(`Received message from peer ${conn.peer}:`, data);
        if (typeof data === "string") {
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: { id: Date.now(), message: data },
          });
        } else {
          console.warn(`Received non-string message from peer ${conn.peer}:`, data);
        }
      });
    });

    peer.onerror((err) => {
      console.error("Peer error:", err);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  const connectToPeer = (peerId: string) => {
    const peer = peerRef.current;
    if (!peer.connections[peerId]) {
      const connection = peer.connectToPeer(peerId);
      if (connection) {
        connection.on("open", () => {
          console.log(`Connection established with peer: ${peerId}`);
          peer.connections[peerId] = connection;
        });
        connection.on("data", (data) =>{
        console.log(`Received message from peer ${connection.peer}:`, data);
        if (typeof data === "string") {
          dispatch({
            type: ActionType.ADD_MESSAGE,
            payload: { id: Date.now(), message: data },
          });
        } else {
          console.warn(`Received non-string message from peer ${connection.peer}:`, data);
        }
      });
        connection.on("close", () => {
          console.log(`Connection closed with peer: ${peerId}`);
          delete peer.connections[peerId];
        });
      }
    }
  }

  return <PeerContext value={{
    connectToPeer,
    peer: peerRef.current
  }}>
    {children}
  </PeerContext>;
};
