import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export const languagesQueryKey = ["lists", "languages"] as const;

export function useLanguages() {
  return useQuery({
    queryKey: languagesQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/api/lists/languages");
      if (error) throw error;
      return data ?? [];
    },
  });
}
