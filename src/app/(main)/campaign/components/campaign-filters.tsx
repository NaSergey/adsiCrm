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
  name: string;
}

export const EMPTY_CAMPAIGN_FILTERS: CampaignFiltersState = {
  partnerId: "",
  brokerId: "",
  country: "",
  lang: "",
  name: "",
};

interface CampaignFiltersProps {
  filters: CampaignFiltersState;
  onChange: (filters: CampaignFiltersState) => void;
}

export function CampaignFilters({ filters, onChange }: CampaignFiltersProps) {
  const t = useTranslations("campaign");
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <section className="mb-8 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <input
        type="text"
        placeholder={t("company_name")}
        value={filters.name}
        onChange={(e) => onChange({ ...filters, name: e.target.value })}
        className="w-full rounded border border-gray-1000 bg-gray-1000 px-3 h-9 text-white placeholder-gray-500 outline-none ring-transparent focus:ring-2 focus:ring-offset-blue-600 md:w-auto md:min-w-48"
      />
      <SelectBroker
        className="w-full md:w-auto md:min-w-48"
        value={filters.brokerId}
        onChange={(v) => onChange({ ...filters, brokerId: v })}
      />
      <SelectPartner
        className="w-full md:w-auto md:min-w-48"
        value={filters.partnerId}
        onChange={(v) => onChange({ ...filters, partnerId: v })}
      />

      {/* On mobile: side-by-side row. On desktop: unwrap into parent flex. */}
      <div className="flex gap-3 md:contents">
        <SelectCountry
          className="flex-1 md:flex-none md:w-16"
          value={filters.country}
          onChange={(v) => onChange({ ...filters, country: v })}
        />
        <SelectLang
          className="flex-1 md:flex-none md:w-16"
          value={filters.lang}
          onChange={(v) => onChange({ ...filters, lang: v })}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        active={hasFilters}
        onClick={() => onChange(EMPTY_CAMPAIGN_FILTERS)}
        disabled={!hasFilters}
        className="w-full md:w-auto md:ml-auto"
      >
        {t("clearFilters")}
      </Button>
    </section>
  );
}
