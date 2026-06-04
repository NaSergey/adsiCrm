"use client";

import { useMemo, useState } from "react";
import { LeadsHeader } from "./components/header/leads-header";
import { EMPTY_LEADS_FILTERS, type LeadsFiltersState, type LeadsTab } from "../../../shared/types/lead";
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
  const [tab, setTab] = useState<LeadsTab>("all");

  // The second tab = the same table with ftd forced on, layered on top of the
  // user's manual filters. (ftdPending is a separate concept — deposit-confirmation
  // flow — and is NOT used for this tab's display.) Memoized so the table keeps a
  // stable filters reference (it resets pagination on identity change).
  const effectiveFilters = useMemo<LeadsFiltersState>(
    () => (tab === "ftdPending" ? { ...filters, ftd: "true" } : filters),
    [tab, filters],
  );

  return (
    <LeadsSelectionProvider>
      <div className="">
        <LeadsOverview
          filters={effectiveFilters}
          onFiltersChange={setFilters}
          canDeleteLeads={canDeleteLeads}
          activeTab={tab}
          onTabChange={setTab}
        />
        <LeadsHeader filters={filters} onFiltersChange={setFilters} canImport={canImport} canExport={canExport} />
        <div className="mt-6">
          <LeadsTable filters={effectiveFilters} ftdConfirmMode={tab === "ftdPending"} />
        </div>
      </div>
    </LeadsSelectionProvider>
  );
}
