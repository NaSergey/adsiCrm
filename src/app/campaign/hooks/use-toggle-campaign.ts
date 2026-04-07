import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { campaignsQueryKey } from "@/features/dialog/create/create-campaign-modal";
import type { Campaign } from "../types";

export function useToggleCampaign(campaign: Campaign) {
  const queryClient = useQueryClient();
  const [override, setOverride] = useState<boolean | null>(null);

  const isActive = override ?? campaign.isActive;

  const { mutate } = useMutation({
    mutationFn: (value: boolean) =>
      fetchClient.PATCH("/campaigns/{id}", {
        params: { path: { id: campaign.id } },
        body: {
          isActive: value,
          comment: campaign.comment,
          funnel: campaign.funnel,
          checkFunnel: campaign.checkFunnel,
          countries: campaign.countries,
          languages: campaign.languages,
          isScheduleEnabled: campaign.isScheduleEnabled,
          timezone: campaign.timezone,
          workingHours: campaign.workingHours,
          ...(campaign.broker?.id && { brokerId: campaign.broker.id }),
          ...(campaign.partner?.id && { partnerId: campaign.partner.id }),
          ...(campaign.manager?.id && { managerId: campaign.manager.id }),
        },
      }),
    onSuccess: (_, value) => {
      setOverride(null);
      queryClient.setQueriesData<{ items: Campaign[]; meta: unknown }>(
        { queryKey: campaignsQueryKey },
        (old) => {
          if (!old?.items) return old;
          return { ...old, items: old.items.map((c) => c.id === campaign.id ? { ...c, isActive: value } : c) };
        },
      );
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
    },
    onError: (_, value) => {
      setOverride(!value);
    },
  });

  const toggle = useCallback((value: boolean) => {
    setOverride(value);
    mutate(value);
  }, [mutate]);

  return { isActive, toggle };
}
