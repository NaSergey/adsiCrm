import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared/api/schema";

export type BrandManager = components["schemas"]["ResponseUserDto"];

export const brandManagersQueryKey = ["users", "BRAND_MANAGER"] as const;

export function useBrandManagers() {
  return useQuery({
    queryKey: brandManagersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/users/by-role/{roleName}", {
        params: { path: { roleName: "BRAND_MANAGER" } },
      });
      if (error) throw error;
      return (data ?? []) as BrandManager[];
    },
  });
}
