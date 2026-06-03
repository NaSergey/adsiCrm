"use client";

import { Input } from "@/shared/ui/input";
import { DateInput } from "@/shared/ui/date-input";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/css";
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
  if (filter.type === "datetime") {
    const hasValue = !!value;
    return (
      <label className="relative flex flex-1 min-w-0 items-center h-9 rounded-md bg-gray-200 dark:bg-gray-1000 px-3 cursor-default transition-colors focus-within:ring-2 focus-within:ring-transparent focus-within:ring-offset-2 focus-within:ring-offset-blue-600">
        {!hasValue && (
          <span className="absolute left-3 right-8 text-sm text-gray-500 pointer-events-none truncate">
            {filter.label}
          </span>
        )}
        <input
          type="datetime-local"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          aria-label={filter.label}
          className={cn(
            "flex-1 min-w-0 w-full bg-transparent outline-none text-sm scheme-dark",
            hasValue ? "text-gray-900 dark:text-white" : "text-transparent caret-transparent"
          )}
        />
        {hasValue && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onChange?.(""); }}
            className="absolute right-2 shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="size-3.5" />
          </button>
        )}
      </label>
    );
  }

  if (filter.type === "date") {
    return (
      <DateInput
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        className="flex-1 min-w-0 w-full"
        aria-label={filter.label}
      />
    );
  }

  return (
    <Input
      placeholder={filter.label}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      className="min-w-30"
      aria-label={filter.label}
    />
  );
}
