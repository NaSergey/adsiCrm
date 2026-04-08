"use client";

import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export interface ServiceFilters {
  email: string;
}

export const EMPTY_SERVICE_FILTERS: ServiceFilters = { email: "" };

interface ServiceFiltersBarProps {
  filters: ServiceFilters;
  onChange: (filters: ServiceFilters) => void;
}

export function ServiceFiltersBar({ filters, onChange }: ServiceFiltersBarProps) {
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <section className="mb-8 flex flex-wrap items-center gap-3">
      <Input
        placeholder="Email"
        value={filters.email}
        onChange={(e) => onChange({ ...filters, email: e.target.value })}
        className="w-64"
      />
      <Button
        variant="ghost"
        size="md"
        active={hasFilters}
        disabled={!hasFilters}
        onClick={() => onChange(EMPTY_SERVICE_FILTERS)}
      >
        Clear
      </Button>
    </section>
  );
}
