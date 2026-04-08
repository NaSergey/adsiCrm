import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { brokersQueryKey } from "../use-brokers";

export function useDeleteBroker({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (ids: number | number[]) => {
      const list = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        list.map((id) => fetchClient.DELETE("/api/brokers/{id}", { params: { path: { id } } })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokersQueryKey });
      onSuccess?.();
    },
  });

  return { remove: mutate, removeAsync: mutateAsync, isPending };
}
