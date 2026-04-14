"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import { EditCampaignForm, type CampaignData } from "./edit/edit-campaign-modal";
import { CreateCampaignForm } from "./create/create-campaign-modal";
import type { CampaignFormValues } from "./schemas/campaign-schema";

type Mode =
  | { type: "edit"; campaign: CampaignData }
  | { type: "create"; initialData?: CampaignFormValues };

interface CampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: CampaignData;
  onSave?: () => void;
  onDelete?: () => void;
  onCreateSuccess?: () => void;
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
            onSuccess={() => { onCreateSuccess?.(); onOpenChange(false); }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
