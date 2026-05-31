import { useContext } from "react";
import { DBContext } from "../context/DBContext";

export const useDB = () => {
    const db = useContext(DBContext);
    if (!db) {
        throw new Error("useDB must be used within a DBProvider");
    }
    return db;
};
