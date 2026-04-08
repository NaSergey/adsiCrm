"use client";

import { useState } from "react";
import { Plus, MousePointerClick, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { CreateCampaignModal } from "@/features/dialog";
import type { ProgramFilter } from "../types";

export interface CampaignSelectionActions {
  isActive: boolean;
  selectedCount: number;
  onToggle: () => void;
  onExit: () => void;
  onEnable: () => void;
  onDisable: () => void;
  onDelete: () => void;
}

interface CampaignToolbarProps {
  programFilter: ProgramFilter;
  onProgramFilterChange: (value: ProgramFilter) => void;
  selection: CampaignSelectionActions;
}

export function CampaignToolbar({ programFilter, onProgramFilterChange, selection }: CampaignToolbarProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const t = useTranslations("campaign");

  const tabs = [
    { id: "all" as ProgramFilter, label: t("allPrograms") },
    { id: "active" as ProgramFilter, label: t("active") },
  ];

  function handleTabChange(value: ProgramFilter) {
    onProgramFilterChange(value);
    if (selection.isActive) selection.onExit();
  }

  function handleCreateOpen() {
    setCreateOpen(true);
    if (selection.isActive) selection.onExit();
  }

  return (
    <section className="mb-6 flex flex-wrap items-center gap-3">
      <TabSwitcher tabs={tabs} activeTab={programFilter} onTabChange={handleTabChange} />

      {selection.isActive && (
        <>
          <div className="h-5 w-px bg-gray-700" />
          <Button size="sm" variant="secondary" disabled={selection.selectedCount === 0} onClick={selection.onEnable}>
            <ToggleRight className="size-4" />
            {t("enableSelected")}
          </Button>
          <Button size="sm" variant="secondary" disabled={selection.selectedCount === 0} onClick={selection.onDisable}>
            <ToggleLeft className="size-4" />
            {t("disableSelected")}
          </Button>
          <Button size="sm" variant="destructive" disabled={selection.selectedCount === 0} onClick={selection.onDelete}>
            <Trash2 className="size-4" />
            {t("deleteSelected")}
          </Button>
        </>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="md"
          variant={selection.isActive ? "ghostActive" : "secondary"}
          className="shrink-0"
          onClick={selection.isActive ? selection.onExit : selection.onToggle}
        >
          {selection.isActive ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
          {selection.isActive ? t("cancelSelect") : t("select")}
        </Button>
        <Button size="md" className="shrink-0" onClick={handleCreateOpen}>
          <Plus className="size-4" />
          {t("newCampaign")}
        </Button>
      </div>

      <CreateCampaignModal open={createOpen} onOpenChange={setCreateOpen} />
    </section>
  );
}
