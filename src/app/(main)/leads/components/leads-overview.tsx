"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { fetchClient } from "@/shared/api";
import { Card } from "./card";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { type LeadsFiltersState, type LeadsTab, filtersToApiBody } from "../../../../shared/types/lead";
import { useLeadsSelection } from "../selection-context";
import { Users, CheckCircle, XCircle, Banknote, PhoneMissed, TrendingUp, AlertCircle, MousePointerClick, X, Trash2 } from "lucide-react";
import { LeadsFiltersSettings } from "./header/leads-filters-settings";

interface LeadsOverviewProps {
  filters: LeadsFiltersState;
  onFiltersChange: (f: LeadsFiltersState) => void;
  canDeleteLeads: boolean;
  activeTab: LeadsTab;
  onTabChange: (tab: LeadsTab) => void;
}

export function LeadsOverview({ filters, onFiltersChange, canDeleteLeads, activeTab, onTabChange }: LeadsOverviewProps) {
  const t = useTranslations("leads");
  const { isSelecting, selectedIds, isDeleting, startSelect, exitSelect, deleteSelected } = useLeadsSelection();
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["leads-statistics", filters],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/leads/get-statistics", {
        body: filtersToApiBody(filters),
      });
      if (error) throw error;
      return data;
    },
  });

  const activeGroup = filters.statisticsGroup;

  const toggleGroup = (group: "rejected" | "invalid") => {
    onFiltersChange({ ...filters, statisticsGroup: activeGroup === group ? "" : group });
  };

  const stats = [
    { label: t("stats.total"),    value: data?.total     ?? 0, icon: Users },
    { label: t("stats.accepted"), value: data?.accepted  ?? 0, icon: CheckCircle },
    { label: t("stats.rejected"), value: data?.rejected  ?? 0, icon: XCircle,     group: "rejected" as const },
    { label: t("stats.deposits"), value: data?.deposits  ?? 0, icon: Banknote },
    { label: t("stats.noAnswer"), value: data?.noAnswer  ?? 0, icon: PhoneMissed, subValue: `${data?.noAnswerPercentage ?? 0}%` },
    { label: t("stats.cr"),       value: `${data?.cr     ?? 0}%`, icon: TrendingUp },
    { label: t("stats.invalid"),  value: data?.invalid   ?? 0, icon: AlertCircle, group: "invalid" as const },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <TabSwitcher<LeadsTab>
          tabs={[
            { id: "all", label: t("tabs.all") },
            { id: "ftdPending", label: t("tabs.ftdPending") },
          ]}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
        <div className="flex items-center gap-2">
          {canDeleteLeads && (
            <>
              {isSelecting && selectedIds.size > 0 && (
                <Button size="sm" variant="destructive" disabled={isDeleting} onClick={() => setConfirmDeleteOpen(true)}>
                  <Trash2 className="size-4" />
                  {`${t("deleteSelected")} (${selectedIds.size})`}
                </Button>
              )}
              <Button
                size="sm"
                variant={isSelecting ? "ghostActive" : "secondary"}
                onClick={isSelecting ? exitSelect : startSelect}
              >
                {isSelecting ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
                {isSelecting ? t("cancelSelect") : t("select")}
              </Button>
            </>
          )}
          <LeadsFiltersSettings />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-11 rounded-xl" />
            ))
          : stats.map((s) => (
              <Card
                key={s.label}
                label={s.label}
                value={s.value}
                subValue={s.subValue}
                icon={s.icon}
                onClick={s.group ? () => toggleGroup(s.group!) : undefined}
                active={!!s.group && activeGroup === s.group}
              />
            ))
        }
      </div>
      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title={t("confirmDeleteTitle")}
        description={t("confirmDeleteDescription")}
        isPending={isDeleting}
        onConfirm={() => { deleteSelected(); setConfirmDeleteOpen(false); }}
      />
    </section>
  );
}
