import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared/api/schema";

export type Manager = components["schemas"]["ResponseUserDto"];

export const managersQueryKey = ["users", "MANAGER"] as const;

export function useManagers() {
  return useQuery({
    queryKey: managersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/api/users/by-role/{roleName}", {
        params: { path: { roleName: "MANAGER" } },
      });
      if (error) throw error;
      return (data ?? []) as Manager[];
    },
  });
}
