"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { CampaignToolbar } from "./campaign-toolbar";
import { CampaignFilters, EMPTY_CAMPAIGN_FILTERS, type CampaignFiltersState } from "./campaign-filters";
import { CampaignList } from "./campaign-list";
import { useCampaignData } from "../hooks/use-campaign-data";
import { useSelectionMode } from "../hooks/use-selection-mode";
import { useBulkCampaignActions } from "../hooks/use-bulk-campaign-actions";
import type { ProgramFilter } from "../types";

export function CampaignView() {
  const t = useTranslations("campaign");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("all");
  const [filters, setFilters] = useState<CampaignFiltersState>(EMPTY_CAMPAIGN_FILTERS);
  const [page, setPage] = useState(1);

  const { campaigns, totalPages, isLoading, error, refetch } = useCampaignData(programFilter, page, filters);
  const selection = useSelectionMode();

  const bulk = useBulkCampaignActions(campaigns, selection.selectedIds, selection.exit);

  function handleProgramFilterChange(f: ProgramFilter) {
    setProgramFilter(f);
    setPage(1);
  }

  function handleFiltersChange(f: CampaignFiltersState) {
    setFilters(f);
    setPage(1);
  }

  return (
    <>
      <CampaignToolbar
        programFilter={programFilter}
        onProgramFilterChange={handleProgramFilterChange}
        selection={{
          isActive: selection.isSelecting,
          selectedCount: selection.selectedIds.size,
          onToggle: selection.toggle,
          onExit: selection.exit,
          onEnable: bulk.enable,
          onDisable: bulk.disable,
          onDelete: bulk.delete,
        }}
      />
      <CampaignFilters filters={filters} onChange={handleFiltersChange} />

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[225.3px] rounded-lg" />
          ))}
        </div>
      )}

      {error && <EmptyState showIcon title={t("error")} onReload={refetch} />}

      {!isLoading && !error && (
        <>
          <CampaignList
            campaigns={campaigns}
            isSelecting={selection.isSelecting}
            selectedIds={selection.selectedIds}
            onToggleSelect={selection.toggleId}
          />
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <PaginationControls
                currentPage={page}
                isLastPage={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
