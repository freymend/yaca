import { useEffect, useState } from "react";
import { addJoinCode, getJoinCode } from "../state/db";


export function useJoinCode() {
  const [joinCode, setJoinCode] = useState<string | null>(null);

  useEffect(() => {
    let _isMounted = true;

    const initJoinCode = async () => {
      const joinCode = await getJoinCode();
      if (joinCode) {
        setJoinCode(joinCode.joinCode);
      } else {
        const newJoinCode = crypto.randomUUID();
        setJoinCode(newJoinCode);
        addJoinCode(newJoinCode);
      }
    };

    initJoinCode();

    return () => {
      _isMounted = false;
    };
  }, []);

  return {
    joinCode,
  };
}
