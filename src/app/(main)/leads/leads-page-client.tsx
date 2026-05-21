"use client";

import { useState } from "react";
import { LeadsHeader } from "./components/header/leads-header";
import { EMPTY_LEADS_FILTERS, type LeadsFiltersState } from "../../../shared/types/lead";
import { LeadsOverview } from "./components/leads-overview";
import { LeadsTable } from "./components/table/leads-table";
import { LeadsSelectionProvider } from "./selection-context";

interface LeadsPageClientProps {
  canDeleteLeads: boolean;
  canImport: boolean;
  canExport: boolean;
}

export function LeadsPageClient({ canDeleteLeads, canImport, canExport }: LeadsPageClientProps) {
  const [filters, setFilters] = useState<LeadsFiltersState>(EMPTY_LEADS_FILTERS);

  return (
    <LeadsSelectionProvider>
      <div className="">
        <LeadsOverview filters={filters} canDeleteLeads={canDeleteLeads} />
        <LeadsHeader filters={filters} onFiltersChange={setFilters} canImport={canImport} canExport={canExport} />
        <div className="mt-6">
          <LeadsTable filters={filters} />
        </div>
      </div>
    </LeadsSelectionProvider>
  );
}
