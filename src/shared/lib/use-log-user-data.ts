import { useEffect } from "react";
import { getAccessToken, getAllTokenData } from "./auth-token";

export function useLogUserData() {
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const data = getAllTokenData(token);
    }
  }, []);
}
