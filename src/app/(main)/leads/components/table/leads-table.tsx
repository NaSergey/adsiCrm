"use client";

import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { PaginationControls } from "@/shared/ui/pagination";
import { type ColumnDef } from "@tanstack/react-table";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/css";
import { type Lead } from "./leads-columns";
import { LeadDetailModal } from "@/features/dialog/leadInfo/lead-detail-modal";
import { type LeadsFiltersState, filtersToApiBody } from "../../../../../shared/types/lead";
import { useLeadsSelection } from "../../selection-context";

export type { Lead };

export interface LeadsTableProps {
  columns: ColumnDef<Lead>[];
  filters: LeadsFiltersState;
  className?: string;
}

export function LeadsTable({
  columns,
  filters,
  className = "",
}: LeadsTableProps) {
  const t = useTranslations("leads");
  const [page, setPage] = useState(1);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { isSelecting, selectedIds, toggleId } = useLeadsSelection();

  if (prevFilters !== filters) {
    setPrevFilters(filters);
    setPage(1);
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["leads", page, filters],
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/leads/find-by-filters", {
        params: { query: { page } },
        body: filtersToApiBody(filters),
      });
      if (error) throw error;
      return data;
    },
  });

  const items = data?.items ?? [];
  const totalPages = data?.meta.totalPages ?? 1;
  const hasError = !!error;

  function handleRowClick(row: Lead) {
    if (isSelecting) {
      toggleId(row.id);
      return;
    }
    setSelectedLead(row);
  }

  function getRowClassName(row: Lead) {
    const isDuplicate = row.dublicate;

    if (!isSelecting) {
      return cn(
        "cursor-pointer group",
        isDuplicate
          ? "bg-green-1000/10 hover:bg-green-1000/1"
          : "hover:bg-gray-1000/30"
      );
    }

    return cn(
      "cursor-pointer select-none group",
      selectedIds.has(row.id)
        ? "!bg-red-900"
        : cn("hover:!bg-red-900/70", isDuplicate && "bg-amber-500/10"),
    );
  }

  return (
    <>
      <div className={cn("bg-gray-1100 rounded-md", className)}>
        <DataTable
          columns={columns}
          data={items}
          isLoading={isLoading}
          className="text-sm"
          rowClassName={getRowClassName}
          onRowClick={handleRowClick}
          loadingContent={
            <div className="grid gap-px">
              {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10 rounded-none" />
              ))}
            </div>
          }
          onErrorContent={
            hasError ? (
              <EmptyState onReload={refetch} showIcon title={t("error")} />
            ) : undefined
          }
          noDataContent={
            !isLoading && !hasError && items.length === 0 ? (
              <EmptyState showIcon title={t("noData")} />
            ) : undefined
          }
        />
        {!hasError && (totalPages > 1 || isLoading) && (
          <PaginationControls
            currentPage={page}
            isLastPage={totalPages}
            onPageChange={(p) => { setPage(p); }}
            disabled={isLoading}
          />
        )}
      </div>

      <LeadDetailModal
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={(open) => { if (!open) setSelectedLead(null); }}
      />
    </>
  );
}
