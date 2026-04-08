import { useEffect } from "react";
import { getAccessToken, getAllTokenData } from "./auth-token";

export function useLogUserData() {
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const data = getAllTokenData(token);
      console.log("=== ALL USER DATA FROM JWT ===");
      console.log(data);
      console.log("==============================");
    }
  }, []);
}
