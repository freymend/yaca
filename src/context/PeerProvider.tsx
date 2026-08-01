import { type ReactNode } from "preact/compat";
import { useCallback, useEffect } from "preact/hooks";
import { useJoinCode } from "../hooks/useJoinCode";
import useMessageStorage from "../hooks/useMessageStorage";
import { ActionType } from "../reducers/messageReducer";
import { PeerContext } from "./PeerContext";
import { peerService } from "../state/peer";

type PeerProviderProps = {
  children: ReactNode;
};

export const PeerProvider = ({ children }: PeerProviderProps) => {
  const { dispatch } = useMessageStorage();
  const { data: joinCode, isLoading } = useJoinCode();

  useEffect(() => {
    if (isLoading) return;

    peerService.initialize(joinCode);
  }, [isLoading, joinCode]);

  useEffect(() => {
    const unsubscribeConnection = peerService.on("connection", ({ detail: conn }) => {
      console.log(`New connection from peer ${conn.peer}`);
    });

    const unsubscribeMessage = peerService.on(
      "message",
      ({ detail: { peerId, data: message } }) => {
        console.log(`Received message from peer ${peerId}:`, message);

        dispatch({
          type: ActionType.ADD_MESSAGE,
          payload: {
            id: Date.now(),
            message: message.text,
            files: message.files,
          },
        });
      },
    );

    const unsubscribeConnected = peerService.on("connected", ({ detail: { peerId } }) => {
      console.log(`Connected to peer: ${peerId}`);
      dispatch({
        type: ActionType.ADD_MESSAGE,
        payload: {
          id: Date.now(),
          message: `Connected to peer: ${peerId}`,
          files: [],
        },
      });
    });

    const unsubscribeDisconnected = peerService.on("disconnected", ({ detail: { peerId } }) => {
      console.log(`Connection closed with peer: ${peerId}`);
    });

    const unsubscribeError = peerService.on("error", ({ detail: { peerId, error } }) => {
      console.error(`Error with peer ${peerId}:`, error);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeMessage();
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeError();
    };
  }, [dispatch]);

  const connectToPeer = useCallback((peerId: string) => {
    peerService.connectToPeer(peerId);
  }, []);

  return (
    <PeerContext.Provider
      value={{
        connectToPeer,
        peer: peerService,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
