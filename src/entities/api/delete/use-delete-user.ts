import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { usersQueryKey } from "@/entities/api/keys";

export function useDeleteUser({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (ids: number | number[]) => {
      const list = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        list.map((id) => fetchClient.DELETE("/users/{id}", { params: { path: { id } } })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      onSuccess?.();
    },
  });

  return { remove: mutate, removeAsync: mutateAsync, isPending };
}
