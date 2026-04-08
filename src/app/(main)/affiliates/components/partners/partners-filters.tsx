"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export interface PartnersFilters {
  name: string;
  email: string;
  comment: string;
  partner_token: string;
}

interface PartnersFiltersBarProps {
  filters: PartnersFilters;
  onChange: (filters: PartnersFilters) => void;
}

export function PartnersFiltersBar({ filters, onChange }: PartnersFiltersBarProps) {
  const t = useTranslations("affiliates");
  const hasFilters = Object.values(filters).some(Boolean);

  const set = (key: keyof PartnersFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...filters, [key]: e.target.value });

  return (
    <section className="mb-8 flex flex-wrap items-center gap-3">
      <Input placeholder={t("filters.name")} value={filters.name} onChange={set("name")} className="w-40" />
      <Input placeholder={t("filters.email")} value={filters.email} onChange={set("email")} className="w-45" />
      <Input placeholder={t("filters.comment")} value={filters.comment} onChange={set("comment")} className="w-40" />
      <Input placeholder={t("filters.token")} value={filters.partner_token} onChange={set("partner_token")} className="w-40" />
      <Button
        variant="ghost"
        size="md"
        active={hasFilters}
        onClick={() => onChange({ name: "", email: "", comment: "", partner_token: "" })}
        disabled={!hasFilters}
        className="ml-auto"
      >
        {t("clear")}
      </Button>
    </section>
  );
}
