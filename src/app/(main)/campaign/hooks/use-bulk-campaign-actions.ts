import { useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { campaignsQueryKey } from "@/features/dialog/create/create-campaign-modal";
import { useDeleteCampaign } from "@/entities/api/delete/use-delete-campaign";
import { useAppToast } from "@/shared/lib/use-app-toast";
import type { Campaign } from "../types";

export function useBulkCampaignActions(
  campaigns: Campaign[],
  selectedIds: Set<number>,
  onDone: () => void,
) {
  const queryClient = useQueryClient();
  const appToast = useAppToast();
  const { removeAsync } = useDeleteCampaign({ onSuccess: () => { onDone(); appToast.deleted("campaign"); } });

  const selected = campaigns.filter((c) => selectedIds.has(c.id));

  async function patchSelected(isActive: boolean) {
    await Promise.all(
      selected.map((c) =>
        fetchClient.PATCH("/campaigns/{id}", {
          params: { path: { id: c.id } },
          body: {
            isActive,
            comment: c.comment,
            funnel: c.funnel,
            checkFunnel: c.checkFunnel,
            countries: c.countries,
            languages: c.languages,
            isScheduleEnabled: c.isScheduleEnabled,
            timezone: c.timezone,
            workingHours: c.workingHours,
            ...(c.broker?.id && { brokerId: c.broker.id }),
            ...(c.partner?.id && { partnerId: c.partner.id }),
            ...(c.manager?.id && { managerId: c.manager.id }),
          },
        }),
      ),
    );
    queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    onDone();
  }

  return {
    enable: () => patchSelected(true),
    disable: () => patchSelected(false),
    delete: () => removeAsync(selected.map((c) => c.id)),
  };
}
