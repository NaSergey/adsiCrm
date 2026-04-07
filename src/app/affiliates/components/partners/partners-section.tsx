"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/css";
import { PartnersFiltersBar, type PartnersFilters } from "./partners-filters";
import { EditPartnerModal, type PartnerData } from "@/features/dialog/edit/edit-partner-modal";
import { usePartners } from "@/entities/api/use-partners";
import type { components } from "@/shared/api/schema";

type ApiPartner = components["schemas"]["ResponseUserDto"];

const EMPTY_FILTERS: PartnersFilters = { name: "", email: "", comment: "", partner_token: "" };
const PAGE_SIZE = 20;

export function PartnersSection() {
  const t = useTranslations("affiliates");
  const columns = useMemo<ColumnDef<ApiPartner>[]>(() => [
    { accessorKey: "id", header: t("columns.id"), size: 80 },
    { accessorKey: "name", header: t("columns.name") },
    { accessorKey: "email", header: t("columns.email") },
    { accessorKey: "comment", header: t("columns.comment") },
    { accessorKey: "partnerToken", header: t("columns.token"), cell: ({ row }) => row.original.partnerToken ?? "—" },
  ], [t]);

  const [filters, setFilters] = useState<PartnersFilters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedPartner, setSelectedPartner] = useState<PartnerData | null>(null);

  const { data, isLoading, error, refetch } = usePartners();

  const partners = data ?? [];
  const hasError = !!error;

  const filtered = partners.filter((p) =>
    (!filters.name || p.name.toLowerCase().includes(filters.name.toLowerCase())) &&
    (!filters.email || p.email.toLowerCase().includes(filters.email.toLowerCase())) &&
    (!filters.comment || p.comment.toLowerCase().includes(filters.comment.toLowerCase())) &&
    (!filters.partner_token || (p.partnerToken ?? "").toLowerCase().includes(filters.partner_token.toLowerCase()))
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <>
      <PartnersFiltersBar filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} />
      <div className={cn("bg-gray-1100 rounded-md")}>
        <DataTable
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          className="text-sm"
          rowClassName="hover:bg-gray-1000/30 cursor-pointer group"
          onRowClick={(row) => setSelectedPartner({
            id: row.id,
            name: row.name,
            email: row.email,
            comment: row.comment,
            partnerToken: row.partnerToken ?? "",
            role: row.role,
            managerId: String(row.managerId ?? ""),
          })}
          loadingContent={
            <div className="grid gap-px">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10 rounded-none" />
              ))}
            </div>
          }
          onErrorContent={
            hasError ? (
              <EmptyState onReload={() => refetch()} showIcon title={t("error")} />
            ) : undefined
          }
          noDataContent={
            !isLoading && !hasError && filtered.length === 0 ? (
              <EmptyState showIcon title={t("noPartners")} />
            ) : undefined
          }
        />
        {!hasError && (totalPages > 1 || isLoading) && (
          <PaginationControls
            currentPage={page}
            isLastPage={totalPages}
            onPageChange={setPage}
            disabled={isLoading}
          />
        )}
      </div>
      {selectedPartner && (
        <EditPartnerModal
          key={selectedPartner.id}
          open={!!selectedPartner}
          onOpenChange={(open) => { if (!open) setSelectedPartner(null); }}
          partner={selectedPartner}
        />
      )}
    </>
  );
}
