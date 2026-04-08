import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared/api/schema";

export type Partner = components["schemas"]["ResponseUserDto"];

export const partnersQueryKey = ["users", "PARTNER"] as const;

export function usePartners() {
  return useQuery({
    queryKey: partnersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/api/users/by-role/{roleName}", {
        params: { path: { roleName: "PARTNER" } },
      });
      if (error) throw error;
      return (data ?? []) as Partner[];
    },
  });
}
