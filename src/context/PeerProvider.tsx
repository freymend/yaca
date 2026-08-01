import { type ReactNode } from "preact/compat";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { useJoinCode } from "../hooks/useJoinCode";
import useMessageStorage from "../hooks/useMessageStorage";
import { ActionType } from "../reducers/messageReducer";
import { PeerJS } from "../state/peer";
import { PeerContext } from "./PeerContext";

type PeerProviderProps = {
  children: ReactNode;
};

export const PeerProvider = ({ children }: PeerProviderProps) => {
  const { dispatch } = useMessageStorage();
  const { data: joinCode, isLoading } = useJoinCode();

  const peerRef = useRef(new PeerJS());

  useEffect(() => {
    if (isLoading) return;

    const peer = peerRef.current;

    peer.initialize(joinCode);

    const unsubscribeConnection = peer.on("connection", ({ detail: conn }) => {
      console.log(`New connection from peer ${conn.peer}`);
    });

    const unsubscribeMessage = peer.on("message", ({ detail: { peerId, data: message } }) => {
      console.log(`Received message from peer ${peerId}:`, message);

      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: {
          id: Date.now(),
          message: message.text,
          files: message.files,
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
  }, [joinCode, isLoading, dispatch]);

  const connectToPeer = useCallback((peerId: string) => {
    peerRef.current.connectToPeer(peerId);
  }, []);

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
