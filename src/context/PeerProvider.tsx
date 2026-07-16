import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "preact/hooks";
import { useDB } from "../hooks/useDB";
import useMessageStorage from "../hooks/useMessageStorage";
import { ActionType } from "../reducers/messageReducer";
import { PeerJS } from "../state/peer";
import { PeerContext } from "./PeerContext";
import type { ReactNode } from "preact/compat";

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

  const peerRef = useRef(new PeerJS());

  useEffect(() => {
    const peer = peerRef.current;

    peer.initialize(joinCode);

    const unsubscribeConnection = peer.on("connection", ({ detail: conn }) => {
      console.log(`New connection from peer ${conn.peer}`);
    });

    const unsubscribeMessage = peer.on("message", ({ detail: { peerId, data: message } }) => {
      console.log(`Received message from peer ${peerId}:`, message);

      if (typeof message !== "string") {
        console.warn("Received non-string message:", message);
        return;
      }

      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: {
          id: Date.now(),
          message,
        },
      });
    });

    const unsubscribeConnected = peer.on("connected", ({ detail: { peerId } }) => {
      console.log(`Connected to peer: ${peerId}`);
    });

    const unsubscribeDisconnected = peer.on("disconnected", ({ detail: { peerId } }) => {
      console.log(`Connection closed with peer: ${peerId}`);
    });

    const unsubscribeError = peer.on("error", ({ detail: { peerId, error } }) => {
      console.error(`Error with peer ${peerId}:`, error);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeError();

      peer.destroy();
    };
  }, [joinCode, dispatch]);

  const connectToPeer = (peerId: string) => {
    peerRef.current.connectToPeer(peerId);
  };

  return (
    <PeerContext.Provider
      value={{
        connectToPeer,
        peer: peerRef.current,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
