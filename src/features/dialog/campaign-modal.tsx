"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { EditCampaignForm, type CampaignData } from "./edit/edit-campaign-modal";
import { CreateCampaignForm } from "./create/create-campaign-modal";
import type { CampaignFormValues } from "./schemas/campaign-schema";
import type { components } from "@/shared/api/schema";

type ResponseCampaignDto = components["schemas"]["ResponseCampaignDto"];

function toCampaignData(c: ResponseCampaignDto): CampaignData {
  return {
    id: String(c.id),
    name: c.name,
    cap: String(c.dailyCap),
    comment: c.comment,
    countries: c.countries,
    languages: c.languages,
    partnerId: String(c.partner?.id ?? ""),
    brokerId: String(c.broker?.id ?? ""),
    managerId: String(c.manager?.id ?? ""),
    status: c.isActive ? "ON" : "OFF",
    checkerFunnel: c.checkFunnel,
    funnelData: c.funnel,
    isScheduleEnabled: c.isScheduleEnabled,
    timezone: c.timezone,
    workingHours: c.workingHours,
  };
}

type Mode =
  | { type: "edit"; campaign: CampaignData }
  | { type: "create"; initialData?: CampaignFormValues };

interface CampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: CampaignData;
  onSave?: () => void;
  onDelete?: () => void;
  onCreateSuccess?: (campaign: CampaignData) => void;
}

export function CampaignModal({
  open,
  onOpenChange,
  campaign,
  onSave,
  onDelete,
  onCreateSuccess,
}: CampaignModalProps) {
  const [mode, setMode] = useState<Mode>({ type: "edit", campaign });

  // Sync when a new campaign is passed (different card opened)
  if (mode.type === "edit" && mode.campaign.id !== campaign.id) {
    setMode({ type: "edit", campaign });
  }

  function handleClose(open: boolean) {
    if (!open) {
      setMode({ type: "edit", campaign });
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-4xl">
        {mode.type === "edit" && (
          <EditCampaignForm
            campaign={mode.campaign}
            onSave={() => { onSave?.(); onOpenChange(false); }}
            onDelete={() => { onDelete?.(); onOpenChange(false); }}
            onDuplicate={(data) => setMode({ type: "create", initialData: data })}
          />
        )}
        {mode.type === "create" && (
          <CreateCampaignForm
            initialData={mode.initialData}
            onSuccess={(created) => { const mapped = toCampaignData(created); onCreateSuccess?.(mapped); setMode({ type: "edit", campaign: mapped }); }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
