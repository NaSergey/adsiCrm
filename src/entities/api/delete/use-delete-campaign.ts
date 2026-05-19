import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { campaignsQueryKey } from "@/features/dialog/create/create-campaign-modal";

export function useDeleteCampaign({ onSuccess }: { onSuccess?: () => void } = {}) {
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: async (ids: number | number[]) => {
      const list = Array.isArray(ids) ? ids : [ids];
      await Promise.all(
        list.map((id) =>
          fetchClient.DELETE("/campaigns/{id}", { params: { path: { id } } }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
      onSuccess?.();
    },
  });

  return { remove: mutate, removeAsync: mutateAsync, isPending };
}
