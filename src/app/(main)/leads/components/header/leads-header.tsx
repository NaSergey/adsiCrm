"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { type LeadsFiltersState, EMPTY_LEADS_FILTERS } from "../../../../../shared/types/lead";
import { LeadsFilterItem } from "../leads-filter-item";
import { LeadsExportButton } from "../leads-export-button";
import { LeadsImportButton } from "../leads-import-button";
import { useFilterConfig } from "./use-filter-config";

interface LeadsHeaderProps {
  filters: LeadsFiltersState;
  onFiltersChange: (f: LeadsFiltersState) => void;
  canImport: boolean;
  canExport: boolean;
}

export function LeadsHeader({ filters, onFiltersChange, canImport, canExport }: LeadsHeaderProps) {
  const t = useTranslations("leads");

  const { isMounted, visibleFilters } = useFilterConfig();
  const [draft, setDraft] = useState<LeadsFiltersState>(filters);

  const handleDraftChange = (id: keyof LeadsFiltersState, value: string) =>
    setDraft((prev) => ({ ...prev, [id]: value }));

  const handleSearch = () => onFiltersChange(draft);

  const handleClearAll = () => {
    setDraft(EMPTY_LEADS_FILTERS);
    onFiltersChange(EMPTY_LEADS_FILTERS);
  };

  const topFilters = visibleFilters.slice(0, 6);
  const rowFilters = visibleFilters.slice(6);
  const hasDraftFilters = Object.values(draft).some(Boolean);

  return (
    <div className="mb-6 space-y-3">
      {/* Mobile: все фильтры + кнопки действий в одной строке */}
      <div className="sm:hidden space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {!isMounted
            ? <Skeleton className="h-9 col-span-2" />
            : visibleFilters.map((f) => <LeadsFilterItem key={f.id} filter={f} filters={draft} onChange={handleDraftChange} />)
          }
        </div>
        <div className="flex items-center gap-2">
          {canImport && <LeadsImportButton />}
          {canExport && <LeadsExportButton filters={filters} />}
          <div className="flex items-center gap-2 ml-auto shrink-0 whitespace-nowrap">
            <Button variant="blue" size="md" onClick={handleSearch}>
              <Search className="size-4" />
            </Button>
            <Button variant="ghost" size="md" onClick={handleClearAll} disabled={!hasDraftFilters}>
              {t("clearAll")}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop: оригинальный layout — 2 строки */}
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap flex-1 min-w-0 items-center gap-2">
          {!isMounted
            ? <Skeleton className="h-9 flex-1" />
            : topFilters.map((f) => <LeadsFilterItem key={f.id} filter={f} filters={draft} onChange={handleDraftChange} />)
          }
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {canImport && <LeadsImportButton />}
          {canExport && <LeadsExportButton filters={filters} />}
        </div>
      </div>
      <div className="hidden sm:flex flex-wrap items-center gap-2">
        {!isMounted
          ? <Skeleton className="h-9 flex-1" />
          : rowFilters.map((f) => <LeadsFilterItem key={f.id} filter={f} filters={draft} onChange={handleDraftChange} />)
        }
        <div className="relative ml-auto shrink-0 flex items-center gap-2 whitespace-nowrap">
          <Button variant="blue" size="md" onClick={handleSearch}>
            <Search className="size-4" />
          </Button>
          <Button variant="ghost" size="md" onClick={handleClearAll} disabled={!hasDraftFilters}>
            {t("clearAll")}
          </Button>
        </div>
      </div>
    </div>
  );
}
