"use client";

import { Input } from "@/shared/ui/input";
import { DateInput } from "@/shared/ui/date-input";
import { type FilterConfig } from "../../../../shared/types/lead";

export type { FilterConfig };

export function FilterItem({
  filter,
  value,
  onChange,
}: {
  filter: FilterConfig;
  value?: string;
  onChange?: (v: string) => void;
}) {
  if (filter.type === "date") {
    return (
      <DateInput
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 min-w-40"
      />
    );
  }
  return (
    <Input
      placeholder={filter.label}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="min-w-30"
    />
  );
}
