import { useState, useEffect } from "preact/hooks";
import { useDB } from "./useDB";

export const useJoinCode = () => {
  const db = useDB();
  const [data, setData] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    db.getJoinCode().then((res) => {
      if (active) {
        setData(res.joinCode);
        setIsLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [db]);

  return { data, isLoading };
};
