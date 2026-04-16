"use client";

import { type FilterConfig, type LeadsFiltersState } from "../../../../shared/types/lead";
import { SelectBroker, SelectPartner, SelectStats, SelectFtd } from "@/entities";
import { SelectCountry } from "@/entities/ui/select-country";
import { SelectCampaign } from "@/entities/ui/select-campaign";
import { SelectLang } from "@/entities/ui/select-lang";
import { FilterItem } from "./filter-item";

interface LeadsFilterItemProps {
  filter: FilterConfig;
  filters: LeadsFiltersState;
  onChange: (id: keyof LeadsFiltersState, value: string) => void;
}

export function LeadsFilterItem({ filter: f, filters, onChange }: LeadsFilterItemProps) {
  const set = (v: string) => onChange(f.id as keyof LeadsFiltersState, v);

  if (f.id === "partner")  return <SelectPartner  className="flex-1 min-w-32" value={filters.partner}  onChange={set} />;
  if (f.id === "broker")   return <SelectBroker   className="flex-1 min-w-32" value={filters.broker}   onChange={set} />;
  if (f.id === "country")  return <SelectCountry  className="flex-1 min-w-32" value={filters.country}  onChange={set} />;
  if (f.id === "campaign") return <SelectCampaign className="flex-1 min-w-32" value={filters.campaign} onChange={set} />;
  if (f.id === "status")   return <SelectStats    className="flex-1 min-w-32" value={filters.status}   onChange={set} />;
  if (f.id === "ftd")      return <SelectFtd      className="flex-1 min-w-32" value={filters.ftd}      onChange={set} />;
  if (f.id === "language") return <SelectLang     className="flex-1 min-w-32" value={filters.language} onChange={set} />;

  return (
    <FilterItem
      filter={f}
      value={filters[f.id as keyof LeadsFiltersState]}
      onChange={set}
    />
  );
}
