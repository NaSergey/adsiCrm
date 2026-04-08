"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { DataTable } from "@/shared/ui/data-table";
import { EmptyState } from "@/shared/ui/empty-state";
import { PaginationControls } from "@/shared/ui/pagination";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/css";
import { EditUserModal } from "@/features/dialog/edit/edit-user-modal";
import { UsersFiltersBar, EMPTY_USERS_FILTERS, type UsersFilters } from "./users-filters";
import { getUsersColumns, type UserItem } from "./users-table";
import { fetchClient } from "@/shared/api";
import { usersQueryKey } from "@/features/dialog/create/create-user-modal";

const PAGE_SIZE = 20;

interface UsersSectionProps {
  isSelecting?: boolean;
  selectedIds?: Set<number>;
  onToggleId?: (id: number) => void;
}

export function UsersSection({ isSelecting = false, selectedIds = new Set(), onToggleId }: UsersSectionProps) {
  const t = useTranslations("users");
  const usersColumns = useMemo(() => getUsersColumns(t as (key: string) => string), [t]);
  const [filters, setFilters] = useState<UsersFilters>(EMPTY_USERS_FILTERS);
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: usersQueryKey,
    queryFn: async () => {
      const { data, error } = await fetchClient.GET("/users");
      if (error) throw error;
      return data;
    },
  });

  const users = data ?? [];
  const hasError = !!error;

  const filtered = users.filter((item) =>
    !filters.email || item.email.toLowerCase().includes(filters.email.toLowerCase())
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const handleRowClick = (user: UserItem) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <UsersFiltersBar filters={filters} onChange={(next) => { setFilters(next); setPage(1); }} />
      <div className={cn("bg-gray-1100 rounded-md")}>
        <DataTable
          columns={usersColumns}
          data={paginatedData}
          isLoading={isLoading}
          className="text-sm"
          rowClassName={(row) => isSelecting
            ? cn("cursor-pointer select-none", selectedIds.has(row.id) ? "!bg-red-900" : "hover:!bg-red-900/70")
            : "hover:bg-gray-1000/30 cursor-pointer group"
          }
          onRowClick={(row) => {
            if (isSelecting) { onToggleId?.(row.id); return; }
            handleRowClick(row);
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
              <EmptyState showIcon title={t("noUsers")} />
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

      <EditUserModal
        key={selectedUser?.id}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={selectedUser ? { id: selectedUser.id, login: selectedUser.name, email: selectedUser.email, role: selectedUser.role, comment: selectedUser.comment ?? undefined } : null}
      />
    </>
  );
}
