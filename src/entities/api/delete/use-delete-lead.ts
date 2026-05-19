import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";

export function useDeleteLead({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (ids: number | number[]) => {
      const list = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        list.map((id) =>
          fetchClient.DELETE("/leads/{id}", { params: { path: { id: String(id) } } }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onSuccess?.();
    },
  });

  return { remove: mutate, removeAsync: mutateAsync, isPending };
}
