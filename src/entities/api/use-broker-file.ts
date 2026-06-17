import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

const brokerFileKey = (brokerId: number, fileType: "add" | "update") =>
  ["broker-file", brokerId, fileType] as const;

export function useBrokerFile(brokerId: number, fileType: "add" | "update", enabled = true) {
  return useQuery({
    queryKey: brokerFileKey(brokerId, fileType),
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/brokers/get-file", {
        body: { brokerId, fileType },
      });
      if (error) throw error;
      return data;
    },
    enabled: enabled && !!brokerId,
  });
}

export function useUpdateBrokerFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { brokerId: number; fileType: "add" | "update"; phpCode: string }) => {
      const { error } = await fetchClient.POST("/brokers/update-file", { body });
      if (error) throw error;
    },
    onSuccess: (_data, { brokerId, fileType }) => {
      queryClient.invalidateQueries({ queryKey: brokerFileKey(brokerId, fileType) });
    },
  });
}

export function useUpdateAndRunBrokerFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: { brokerId: number; fileType: "add" | "update"; phpCode: string }) => {
      const { data, error } = await fetchClient.POST("/brokers/update-and-run-file", { body });
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, { brokerId, fileType }) => {
      queryClient.invalidateQueries({ queryKey: brokerFileKey(brokerId, fileType) });
    },
  });
}
