"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/shared/lib/use-local-storage";
import { usePermissions } from "@/shared/lib/use-permissions";
import type { FilterConfig } from "../../../../../shared/types/lead";
import { INITIAL_FILTERS, ALL_IDS, DEFAULT_VISIBLE, LIMITED_FILTERS, LS_KEY_VISIBLE, LS_KEY_ORDER } from "./constants";

export function useFilterConfig() {
  const t = useTranslations("leads");
  const { hasFeature } = usePermissions();
  const hasFullFilters = hasFeature("full_leads_filters");

  const translatedFilters = React.useMemo<FilterConfig[]>(
    () => INITIAL_FILTERS.map((f) => ({ ...f, label: t(`filters.${f.id}` as never) })),
    [t]
  );

  // Determine which filters are available based on permissions
  const availableFilters = hasFullFilters ? ALL_IDS : LIMITED_FILTERS;
  const defaultVisible = hasFullFilters ? DEFAULT_VISIBLE : LIMITED_FILTERS;

  const [visibleIds, setVisibleIds, isMounted] = useLocalStorage<string[]>(LS_KEY_VISIBLE, defaultVisible);
  const [filterOrder, setFilterOrder] = useLocalStorage<string[]>(LS_KEY_ORDER, availableFilters);

  const fullOrder = React.useMemo(() => {
    const missing = availableFilters.filter((id) => !filterOrder.includes(id));
    return missing.length ? [...filterOrder, ...missing] : filterOrder;
  }, [filterOrder, availableFilters]);

  const orderedFilters = React.useMemo(
    () => fullOrder
      .filter((id) => availableFilters.includes(id))
      .map((id) => translatedFilters.find((f) => f.id === id))
      .filter((f): f is FilterConfig => Boolean(f)),
    [fullOrder, translatedFilters, availableFilters]
  );

  const visibleFilters = orderedFilters.filter((f) => visibleIds.includes(f.id));

  const toggleFilter = (id: string) =>
    setVisibleIds((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);

  return {
    isMounted,
    visibleIds,
    orderedFilters,
    visibleFilters,
    toggleFilter,
    setFilterOrder,
  };
}
