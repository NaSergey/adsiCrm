import { useQueries } from "@tanstack/react-query";
import { fetchClient } from "@/shared/api";
import { campaignsQueryKey } from "@/entities/api/keys";
import type { CampaignFiltersState } from "../types";
import type { ProgramFilter } from "../types";

/** Тело POST /campaigns/find-by-filters. Используется и клиентом, и SSR-префетчем. */
export function campaignFilterBody(isActive: boolean, filters: CampaignFiltersState) {
  return {
    partnerId: filters.partnerId ? Number(filters.partnerId) : undefined,
    brokerId: filters.brokerId ? Number(filters.brokerId) : undefined,
    managerId: undefined,
    name: filters.name || undefined,
    isActive,
    countries: filters.country ? [filters.country] : [],
    languages: filters.lang ? [filters.lang] : [],
  };
}

/** React-query ключ кампаний. Должен совпадать на клиенте и в SSR-префетче. */
export function campaignQueryKey(page: number, filters: CampaignFiltersState, kind: "active" | "inactive") {
  return [...campaignsQueryKey, page, filters, kind] as const;
}

function buildQueryFn(isActive: boolean, page: number, filters: CampaignFiltersState) {
  return async () => {
    const { data, error } = await fetchClient.POST("/campaigns/find-by-filters", {
      params: { query: { page } },
      body: campaignFilterBody(isActive, filters),
    });
    if (error) throw error;
    return data;
  };
}

function mergeAndDedup<T extends { id: number }>(a: T[], b: T[]): T[] {
  const seen = new Set<number>();
  return [...a, ...b].filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).sort((x, y) => x.id - y.id);
}

export function useCampaignData(programFilter: ProgramFilter, page: number, filters: CampaignFiltersState) {
  const isAll = programFilter === "all";

  const [activeResult, inactiveResult] = useQueries({
    queries: [
      {
        queryKey: campaignQueryKey(page, filters, "active"),
        queryFn: buildQueryFn(true, page, filters),
      },
      {
        queryKey: campaignQueryKey(page, filters, "inactive"),
        queryFn: buildQueryFn(false, page, filters),
        enabled: isAll,
      },
    ],
  });

  const activeItems = activeResult.data?.items ?? [];
  const inactiveItems = inactiveResult.data?.items ?? [];

  const campaigns = isAll ? mergeAndDedup(activeItems, inactiveItems) : activeItems;

  const totalPages = isAll
    ? Math.max(activeResult.data?.meta.totalPages ?? 1, inactiveResult.data?.meta.totalPages ?? 1)
    : (activeResult.data?.meta.totalPages ?? 1);

  const isLoading = activeResult.isLoading || (isAll && inactiveResult.isLoading);
  const error = activeResult.error ?? (isAll ? inactiveResult.error : null);

  function refetch() {
    activeResult.refetch();
    if (isAll) inactiveResult.refetch();
  }

  return { campaigns, totalPages, isLoading, error, refetch };
}
