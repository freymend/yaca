import { createContext } from "react";
import type { RepoDB } from "../state/db";

export const DBContext = createContext<RepoDB | null>(null);
