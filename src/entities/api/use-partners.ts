import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export const partnersQueryKey = ["users", "PARTNER"] as const;

export function usePartners() {
  return useQuery({
    queryKey: partnersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/users/by-role/{roleName}", {
        params: { path: { roleName: "PARTNER" } },
      });
      if (error) throw error;
      return data ?? [];
    },
  });
}
