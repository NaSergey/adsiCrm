import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export const rolesQueryKey = ["users", "roles"] as const;

export function useRoles() {
  return useQuery({
    queryKey: rolesQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/api/users/roles");
      if (error) throw error;
      return (data ?? []) as string[];
    },
    staleTime: Infinity,
  });
}
