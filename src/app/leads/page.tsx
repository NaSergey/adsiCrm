"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { LeadsHeader } from "./components/header/leads-header";
import { EMPTY_LEADS_FILTERS, type LeadsFiltersState } from "./types";
import { LeadsOverview } from "./components/leads-overview";
import { LeadsTable } from "./components/table/leads-table";
import { getLeadsColumns } from "./components/table/leads-columns";
import { LeadsSelectionProvider } from "./selection-context";

export default function LeadsPage() {
  const t = useTranslations("leads");
  const columns = useMemo(() => getLeadsColumns(t as (key: string) => string), [t]);
  const [filters, setFilters] = useState<LeadsFiltersState>(EMPTY_LEADS_FILTERS);

  return (
    <LeadsSelectionProvider>
      <div className="p-6 px-10">
        <LeadsOverview filters={filters} />
        <LeadsHeader filters={filters} onFiltersChange={setFilters} />
        <div className="mt-6">
          <LeadsTable columns={columns} filters={filters} />
        </div>
      </div>
    </LeadsSelectionProvider>
  );
}
