"use client";

import { useState } from "react";
import { Plus, MousePointerClick, Trash2, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { CreateCampaignModal } from "@/features/dialog";
import { SelectCountry } from "@/entities/ui/select-country";
import { SelectLang } from "@/entities/ui/select-lang";
import { SelectBroker } from "@/entities/ui/select-broker";
import { SelectPartner } from "@/entities/ui/select-partner";
import type { ProgramFilter } from "../types";

export interface CampaignFiltersState {
  partnerId: string;
  brokerId: string;
  country: string;
  lang: string;
  name: string;
}

export const EMPTY_CAMPAIGN_FILTERS: CampaignFiltersState = {
  partnerId: "",
  brokerId: "",
  country: "",
  lang: "",
  name: "",
};

export interface CampaignSelectionActions {
  isActive: boolean;
  selectedCount: number;
  onToggle: () => void;
  onExit: () => void;
  onEnable: () => void;
  onDisable: () => void;
  onDelete: () => void;
}

interface CampaignControlsProps {
  programFilter: ProgramFilter;
  onProgramFilterChange: (value: ProgramFilter) => void;
  canManageCampaigns?: boolean;
  selection: CampaignSelectionActions;
  filters: CampaignFiltersState;
  onFiltersChange: (filters: CampaignFiltersState) => void;
}

export function CampaignControls({
  programFilter,
  onProgramFilterChange,
  canManageCampaigns = false,
  selection,
  filters,
  onFiltersChange,
}: CampaignControlsProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const t = useTranslations("campaign");
  const hasFilters = Object.values(filters).some(Boolean);

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
    <div className="md:pb-6 pb-0 space-y-3">

      {/* ── Row 1: tabs + (desktop actions) + new campaign ── */}
      <div className="flex items-center gap-3">
        <TabSwitcher tabs={tabs} activeTab={programFilter} onTabChange={handleTabChange} />

        {/* Desktop: action buttons appear inline when selecting */}
        {selection.isActive && (
          <div className="hidden md:flex items-center gap-2 ml-2">
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
            <div className="h-5 w-px bg-gray-700" />
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Desktop: select / cancel button */}
          {canManageCampaigns && (
            <Button
              size="sm"
              variant={selection.isActive ? "ghostActive" : "secondary"}
              className="hidden md:inline-flex shrink-0"
              onClick={selection.isActive ? selection.onExit : selection.onToggle}
            >
              {selection.isActive ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
              {selection.isActive ? t("cancelSelect") : t("select")}
            </Button>
          )}
          <Button size="sm" className="shrink-0" onClick={handleCreateOpen}>
            <Plus className="size-4" />
            <span className="">{t("newCampaign")}</span>
          </Button>
        </div>
      </div>

      {/* ── Row 2 mobile only: select btn OR action buttons ── */}
      {canManageCampaigns && (
        <div className="md:hidden flex justify-end">
          {selection.isActive ? (
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" disabled={selection.selectedCount === 0} onClick={selection.onEnable}>
                <ToggleRight className="size-4" />
                <span className="hidden sm:inline">{t("enableSelected")}</span>
              </Button>
              <Button size="sm" variant="secondary" disabled={selection.selectedCount === 0} onClick={selection.onDisable}>
                <ToggleLeft className="size-4" />
                <span className="hidden sm:inline">{t("disableSelected")}</span>
              </Button>
              <Button size="sm" variant="destructive" disabled={selection.selectedCount === 0} onClick={selection.onDelete}>
                <Trash2 className="size-4" />
                <span className="hidden sm:inline">{t("deleteSelected")}</span>
              </Button>
              <Button size="sm" variant="ghostActive" className="ml-auto shrink-0" onClick={selection.onExit}>
                <X className="size-4" />
                {t("cancelSelect")}
              </Button>
            </div>
          ) : (
            <Button size="sm" variant="secondary" onClick={selection.onToggle}>
              <MousePointerClick className="size-4" />
              {t("select")}
            </Button>
          )}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="flex flex-col gap-3 md:pb-0 pb-6 md:flex-row md:flex-wrap md:items-center">
        <input
          type="text"
          placeholder={t("company_name")}
          value={filters.name}
          onChange={(e) => onFiltersChange({ ...filters, name: e.target.value })}
          className="w-full rounded border border-gray-1000 bg-gray-1000 px-3 h-9 text-white placeholder-gray-500 outline-none ring-transparent focus:ring-2 focus:ring-offset-blue-600 md:w-auto md:min-w-48"
        />
        <SelectBroker
          className="w-full md:w-auto md:min-w-48"
          value={filters.brokerId}
          onChange={(v) => onFiltersChange({ ...filters, brokerId: v })}
        />
        <SelectPartner
          className="w-full md:w-auto md:min-w-48"
          value={filters.partnerId}
          onChange={(v) => onFiltersChange({ ...filters, partnerId: v })}
        />
        <div className="flex gap-3 md:contents">
          <SelectCountry
            className="flex-1 md:flex-none md:w-16"
            value={filters.country}
            onChange={(v) => onFiltersChange({ ...filters, country: v })}
          />
          <SelectLang
            className="flex-1 md:flex-none md:w-16"
            value={filters.lang}
            onChange={(v) => onFiltersChange({ ...filters, lang: v })}
          />
        </div>
        <Button
          variant="ghost"
          size="md"
          active={hasFilters}
          onClick={() => onFiltersChange(EMPTY_CAMPAIGN_FILTERS)}
          disabled={!hasFilters}
          className="w-full md:bg-transparent bg- md:w-auto md:ml-auto"
        >
          {t("clearFilters")}
        </Button>
      </div>

      <CreateCampaignModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
