"use client";

import { useTranslations } from "next-intl";
import { Select, type SelectOption } from "@/shared/ui/select";
import { DateInput } from "@/shared/ui/date-input";
import { Button } from "@/shared/ui/button";

export interface LogsFilters {
  date: string;
  category: "leads" | "brokers";
}

export const EMPTY_LOGS_FILTERS: LogsFilters = {
  date: new Date().toISOString().slice(0, 10),
  category: "leads",
};

interface LogsFiltersBarProps {
  filters: LogsFilters;
  onChange: (filters: LogsFilters) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function LogsFiltersBar({ filters, onChange, onSearch, isLoading }: LogsFiltersBarProps) {
  const t = useTranslations("logs");

  const categoryOptions: SelectOption[] = [
    { value: "leads", label: t("categories.leads") },
    { value: "brokers", label: t("categories.brokers") },
  ];

  return (
    <section className="flex flex-wrap items-end gap-2">
      <DateInput
        value={filters.date}
        onChange={(e) => onChange({ ...filters, date: e.target.value })}
        className="shrink-0 w-45"
      />
      <Select
        options={categoryOptions}
        value={filters.category}
        onChange={(v) => onChange({ ...filters, category: v as LogsFilters["category"] })}
        className="shrink-0 w-40"
      />
      <Button variant="blue" size="md" onClick={onSearch} disabled={!filters.date || isLoading} className="shrink-0">
        {isLoading ? t("loading") : t("search")}
      </Button>
    </section>
  );
}
