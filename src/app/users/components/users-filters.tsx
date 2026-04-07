"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export interface UsersFilters {
  email: string;
}

export const EMPTY_USERS_FILTERS: UsersFilters = { email: "" };

interface UsersFiltersBarProps {
  filters: UsersFilters;
  onChange: (filters: UsersFilters) => void;
}

export function UsersFiltersBar({ filters, onChange }: UsersFiltersBarProps) {
  const t = useTranslations("users");
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
        className="min-w-32"
        active={hasFilters}
        disabled={!hasFilters}
        onClick={() => onChange(EMPTY_USERS_FILTERS)}
      >
        {t("clear")}
      </Button>
    </section>
  );
}
