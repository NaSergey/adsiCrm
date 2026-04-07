"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { SelectCountry } from "@/entities/ui/select-country";
import { SelectLang } from "@/entities/ui/select-lang";
import { SelectBroker } from "@/entities/ui/select-broker";
import { SelectPartner } from "@/entities/ui/select-partner";

export interface CampaignFiltersState {
  partnerId: string;
  brokerId: string;
  country: string;
  lang: string;
}

export const EMPTY_CAMPAIGN_FILTERS: CampaignFiltersState = {
  partnerId: "",
  brokerId: "",
  country: "",
  lang: "",
};

interface CampaignFiltersProps {
  filters: CampaignFiltersState;
  onChange: (filters: CampaignFiltersState) => void;
}

export function CampaignFilters({ filters, onChange }: CampaignFiltersProps) {
  const t = useTranslations("campaign");
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <section className="mb-8 flex flex-wrap items-center gap-3">
      <SelectBroker className="min-w-48" value={filters.brokerId} onChange={(v) => onChange({ ...filters, brokerId: v })} />
      <SelectPartner className="min-w-48" value={filters.partnerId} onChange={(v) => onChange({ ...filters, partnerId: v })} />
      <SelectCountry className="w-16" value={filters.country} onChange={(v) => onChange({ ...filters, country: v })} />
      <SelectLang className="w-16" value={filters.lang} onChange={(v) => onChange({ ...filters, lang: v })} />
      <Button
        variant="ghost"
        size="md"
        active={hasFilters}
        onClick={() => onChange(EMPTY_CAMPAIGN_FILTERS)}
        disabled={!hasFilters}
        className="ml-auto"
      >
        {t("clearFilters")}
      </Button>
    </section>
  );
}
