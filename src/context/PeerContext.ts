import { createContext } from "preact";
import type { PeerJS } from "../state/peer";

interface PeerContextValue {
  connectToPeer: (peerId: string) => void;
  peer: PeerJS;
}

export const PeerContext = createContext<PeerContextValue | null>(null);
