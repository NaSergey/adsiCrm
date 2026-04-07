import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export const countriesQueryKey = ["lists", "countries"] as const;

export function useCountries() {
  return useQuery({
    queryKey: countriesQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/lists/countries");
      if (error) throw error;
      return data ?? [];
    },
  });
}
