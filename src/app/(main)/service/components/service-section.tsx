"use client";

import { useState, useMemo } from "react";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/css";
import { ConfirmModal } from "@/features/dialog/status/confirm-modal";
import { ServiceFiltersBar, EMPTY_SERVICE_FILTERS, type ServiceFilters } from "./service-filters";
import { serviceColumns, type ServiceItem } from "./service-table";

interface ServiceSectionProps {
  data: ServiceItem[];
  isLoading?: boolean;
  error?: Error | null;
  pageSize?: number;
  onRefresh?: () => void;
}

export function ServiceSection({
  data,
  isLoading = false,
  error,
  pageSize = 20,
  onRefresh,
}: ServiceSectionProps) {
  const [filters, setFilters] = useState<ServiceFilters>(EMPTY_SERVICE_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<ServiceItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const hasError = !!error;

  const filtered = data.filter((item) =>
    !filters.email || item.login_email.toLowerCase().includes(filters.email.toLowerCase())
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const handleFiltersChange = (next: ServiceFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleRowClick = (item: ServiceItem) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (selectedItem) {
      // TODO: Call API to delete the user
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    }
  };

  return (
    <>
      <ServiceFiltersBar filters={filters} onChange={handleFiltersChange} />
      <div className={cn("bg-gray-1100 rounded-md")}>
        <DataTable
          columns={serviceColumns}
          data={paginatedData}
          isLoading={isLoading}
          className="text-sm"
          rowClassName="hover:bg-gray-1000/30 cursor-pointer group"
          onRowClick={handleRowClick}
          loadingContent={
            <div className="grid gap-px">
              {Array.from({ length: pageSize }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10 rounded-none" />
              ))}
            </div>
          }
          onErrorContent={
            hasError ? (
              <EmptyState onReload={onRefresh} showIcon title="Something went wrong, please reload" />
            ) : undefined
          }
          noDataContent={
            !isLoading && !hasError && filtered.length === 0 ? (
              <EmptyState showIcon title="No data" />
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

      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete user?"
        description={`Delete ${selectedItem?.login_email || "this user"}? This action cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
