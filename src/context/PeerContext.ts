import { createContext } from "react";
import type { PeerJS } from "../state/peer";

export const PeerContext = createContext<PeerJS | null>(null);
