"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useLocalStorage } from "@/shared/lib/use-local-storage";
import type { FilterConfig } from "../../types";
import { INITIAL_FILTERS, ALL_IDS, DEFAULT_VISIBLE, LS_KEY_VISIBLE, LS_KEY_ORDER } from "./constants";

export function useFilterConfig() {
  const t = useTranslations("leads");

  const translatedFilters = React.useMemo<FilterConfig[]>(
    () => INITIAL_FILTERS.map((f) => ({ ...f, label: t(`filters.${f.id}` as never) })),
    [t]
  );

  const [visibleIds, setVisibleIds, isMounted] = useLocalStorage<string[]>(LS_KEY_VISIBLE, DEFAULT_VISIBLE);
  const [filterOrder, setFilterOrder] = useLocalStorage<string[]>(LS_KEY_ORDER, ALL_IDS);

  const fullOrder = React.useMemo(() => {
    const missing = ALL_IDS.filter((id) => !filterOrder.includes(id));
    return missing.length ? [...filterOrder, ...missing] : filterOrder;
  }, [filterOrder]);

  const orderedFilters = React.useMemo(
    () => fullOrder.map((id) => translatedFilters.find((f) => f.id === id)).filter((f): f is FilterConfig => Boolean(f)),
    [fullOrder, translatedFilters]
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
