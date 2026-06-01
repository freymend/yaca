import { useSuspenseQuery } from "@tanstack/react-query";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import { useDB } from "../hooks/useDB";
import { PeerJS } from "../state/peer";
import { PeerContext } from "./PeerContext";

type PeerProviderProps = {
  children: ReactNode;
};

export const PeerProvider = ({ children }: PeerProviderProps) => {
  const db = useDB();

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
    });

    peer.onerror((err) => {
      console.error("Peer error:", err);
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return <PeerContext value={peerRef.current}>{children}</PeerContext>;
};
