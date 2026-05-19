import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared/api/schema";

export type Broker = components["schemas"]["ResponseBrokerDto"];

export const brokersQueryKey = ["brokers"] as const;

export function useBrokers() {
  return useQuery({
    queryKey: brokersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/brokers");
      if (error) throw error;
      return (data ?? []) as Broker[];
    },
  });
}
