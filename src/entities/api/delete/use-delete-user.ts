import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { usersQueryKey } from "@/features/dialog/create/create-user-modal";

export function useDeleteUser({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (ids: number | number[]) => {
      const list = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        list.map((id) => fetchClient.DELETE("/api/users/{id}", { params: { path: { id } } })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      onSuccess?.();
    },
  });

  return { remove: mutate, removeAsync: mutateAsync, isPending };
}
