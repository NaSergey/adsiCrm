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
    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <DateInput
          value={filters.date}
          onChange={(e) => onChange({ ...filters, date: e.target.value })}
          className="w-full"
        />
        <Select
          options={categoryOptions}
          value={filters.category}
          onChange={(v) => onChange({ ...filters, category: v as LogsFilters["category"] })}
          className="w-full"
        />
      </div>
    </section>
  );
}
