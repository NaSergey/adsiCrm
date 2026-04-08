import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export function useBrokerFile(brokerId: number, fileType: "add" | "update", enabled = true) {
  return useQuery({
    queryKey: ["broker-file", brokerId, fileType],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/api/brokers/get-file", {
        body: { brokerId, fileType },
      });
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!brokerId,
  });
}

export function useUpdateBrokerFile() {
  return useMutation({
    mutationFn: async (body: { brokerId: number; fileType: "add" | "update"; phpCode: string }) => {
      const { error } = await fetchClient.POST("/api/brokers/update-file", { body });
      if (error) throw error;
    },
  });
}

export function useUpdateAndRunBrokerFile() {
  return useMutation({
    mutationFn: async (body: { brokerId: number; fileType: "add" | "update"; phpCode: string }) => {
      const { data, error } = await fetchClient.POST("/api/brokers/update-and-run-file", { body });
      if (error) throw error;
      return data;
    },
  });
}
