"use client";

import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/css";
import { type Lead, getLeadsColumns } from "./leads-columns";
import { LeadDetailModal } from "@/features/dialog/leadInfo/lead-detail-modal";
import { EditPartnerModal, type PartnerData } from "@/features/dialog/edit/edit-partner-modal";
import { EditBrokerModal, type BrokerData } from "@/features/dialog/edit/edit-broker-modal";
import { usePartners } from "@/entities/api/use-partners";
import { useBrokers } from "@/entities/api/use-brokers";
import { type LeadsFiltersState, filtersToApiBody } from "../../../../../shared/types/lead";
import { useLeadsSelection } from "../../selection-context";

export type { Lead };

export interface LeadsTableProps {
  filters: LeadsFiltersState;
  className?: string;
}

export function LeadsTable({
  filters,
  className = "",
}: LeadsTableProps) {
  const t = useTranslations("leads");
  const [page, setPage] = useState(1);
  const [prevFilters, setPrevFilters] = useState(filters);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [openPartnerId, setOpenPartnerId] = useState<number | null>(null);
  const [openBrokerId, setOpenBrokerId] = useState<number | null>(null);
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

  const { data: partners } = usePartners();
  const { data: brokers } = useBrokers();

  const handleOpenPartner = useCallback((id: number) => setOpenPartnerId(id), []);
  const handleOpenBroker = useCallback((id: number) => setOpenBrokerId(id), []);

  const columns = useMemo(
    () => getLeadsColumns(t as (key: string) => string, {
      onOpenPartner: handleOpenPartner,
      onOpenBroker: handleOpenBroker,
    }),
    [t, handleOpenPartner, handleOpenBroker],
  );

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
          ? "bg-yellow-100/20 hover:bg-yellow-400"
          : "hover:bg-gray-1000/30"
      );
    }

    return cn(
      "cursor-pointer select-none group",
      selectedIds.has(row.id)
        ? "!bg-red-900"
        : cn("hover:!bg-red-900/70", isDuplicate && "bg-yellow-100/20"),
    );
  }

  const partnerToEdit = useMemo<PartnerData | null>(() => {
    if (openPartnerId == null || !partners) return null;
    const p = partners.find((x) => x.id === openPartnerId);
    if (!p) return null;
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      comment: p.comment,
      partnerToken: p.partnerToken ?? "",
      role: p.role,
      managerId: String(p.managerId ?? ""),
    };
  }, [openPartnerId, partners]);

  const brokerToEdit = useMemo<BrokerData | null>(() => {
    if (openBrokerId == null || !brokers) return null;
    const b = brokers.find((x) => x.id === openBrokerId);
    if (!b) return null;
    return {
      id: String(b.id),
      name: b.name,
      comment: b.comment,
      managerId: b.brandManager ? String(b.brandManager.id) : "",
    };
  }, [openBrokerId, brokers]);

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

      {partnerToEdit && (
        <EditPartnerModal
          key={`partner-${partnerToEdit.id}`}
          open={!!partnerToEdit}
          onOpenChange={(open) => { if (!open) setOpenPartnerId(null); }}
          partner={partnerToEdit}
        />
      )}

      {brokerToEdit && (
        <EditBrokerModal
          key={`broker-${brokerToEdit.id}`}
          open={!!brokerToEdit}
          onOpenChange={(open) => { if (!open) setOpenBrokerId(null); }}
          broker={brokerToEdit}
          onDelete={() => setOpenBrokerId(null)}
        />
      )}
    </>
  );
}
