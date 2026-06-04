import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export function useConfirmFtd({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await fetchClient.GET("/leads/confirm-ftd/{id}", {
        params: { path: { id: String(id) } },
      });
      if (error) throw error;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["lead", id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["leads-statistics"] });
      onSuccess?.();
    },
  });

  return { confirmFtd: mutate, confirmFtdAsync: mutateAsync, isPending };
}
