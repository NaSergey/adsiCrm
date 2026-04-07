import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export const managersQueryKey = ["users", "MANAGER"] as const;

export function useManagers() {
  return useQuery({
    queryKey: managersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/users/by-role/{roleName}", {
        params: { path: { roleName: "MANAGER" } },
      });
      if (error) throw error;
      return data ?? [];
    },
  });
}
