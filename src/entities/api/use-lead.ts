import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export function useLeadById(id: number | null) {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/leads/{id}", {
        params: { path: { id: String(id) } },
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}
