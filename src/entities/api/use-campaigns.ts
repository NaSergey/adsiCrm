import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared";

export type Campaign = components["schemas"]["ResponseCampaignDto"];

export const campaignsSelectQueryKey = ["campaigns", "select"] as const;

export function useCampaigns() {
  return useQuery({
    queryKey: campaignsSelectQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/campaigns/find-by-filters", {
        params: { query: { page: 1 } },
        body: { isActive: true, countries: [], languages: [] },
      });
      if (error) throw error;
      return (data?.items ?? []) as Campaign[];
    },
  });
}
