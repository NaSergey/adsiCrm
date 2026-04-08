"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/css";
import { EditBrokerModal, type BrokerData } from "@/features/dialog/edit/edit-broker-modal";
import { useBrokers } from "@/entities";
import { useAffiliatesSelection } from "../../selection-context";
import type { components } from "@/shared/api/schema";

type ApiBroker = components["schemas"]["ResponseBrokerDto"];

const PAGE_SIZE = 20;

export function BrokersSection() {
  const t = useTranslations("affiliates");
  const columns = useMemo<ColumnDef<ApiBroker>[]>(() => [
    { accessorKey: "id", header: t("columns.id"), size: 80 },
    { accessorKey: "name", header: t("columns.name") },
    { accessorKey: "comment", header: t("columns.comment") },
    {
      accessorKey: "brandManager",
      header: t("columns.brandManager"),
      cell: ({ row }) => row.original.brandManager?.name ?? "—",
    },
  ], [t]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState<BrokerData | null>(null);
  const { isSelecting, selectedIds, toggleId } = useAffiliatesSelection();

  const { data, isLoading, error, refetch } = useBrokers();

  const brokers = data ?? [];

  const filtered = brokers.filter(
    (b) => !search || b.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const hasError = !!error;

  return (
    <>
      <section className="mb-8 flex flex-wrap items-center gap-3">
        <Input
          placeholder={t("searchByName")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-[240px]"
        />
        <Button
          variant="ghost"
          size="md"
          active={Boolean(search)}
          onClick={() => { setSearch(""); setPage(1); }}
          disabled={!search}
          className="ml-auto"
        >
          {t("clear")}
        </Button>
      </section>
      <div className={cn("bg-gray-1100 rounded-md")}>
        <DataTable
          columns={columns}
          data={paginatedData}
          isLoading={isLoading}
          className="text-sm"
          rowClassName={(row) => isSelecting
            ? cn("cursor-pointer select-none", selectedIds.has(row.id) ? "!bg-red-900" : "hover:!bg-red-900/70")
            : "hover:bg-gray-1000/30 cursor-pointer group"
          }
          onRowClick={(row) => {
            if (isSelecting) { toggleId(row.id); return; }
            setSelectedBroker({
              id: String(row.id),
              name: row.name,
              comment: row.comment,
              managerId: row.brandManager ? String(row.brandManager.id) : "",
            });
          }}
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
              <EmptyState showIcon title={t("noBrokers")} />
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
      {selectedBroker && (
        <EditBrokerModal
          open={!!selectedBroker}
          onOpenChange={(open) => { if (!open) setSelectedBroker(null); }}
          broker={selectedBroker}
          onSuccess={() => { setSelectedBroker(null); refetch(); }}
          onDelete={() => setSelectedBroker(null)}
        />
      )}
    </>
  );
}
