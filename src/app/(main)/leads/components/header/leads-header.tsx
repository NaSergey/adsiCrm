"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal, X, GripVertical } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/css";
import { type LeadsFiltersState, EMPTY_LEADS_FILTERS } from "../../types";
import { LeadsFilterItem } from "../leads-filter-item";
import { LeadsExportButton } from "../leads-export-button";
import { LeadsImportButton } from "../leads-import-button";
import * as React from "react";
import { useFilterConfig } from "./use-filter-config";
import { useDragReorder } from "./use-drag-reorder";
import { useDropdown } from "./use-dropdown";
interface LeadsHeaderProps {
  filters: LeadsFiltersState;
  onFiltersChange: (f: LeadsFiltersState) => void;
  canImport: boolean;
  canExport: boolean;
}

export function LeadsHeader({ filters, onFiltersChange, canImport, canExport }: LeadsHeaderProps) {
  const t = useTranslations("leads");

  const { isMounted, visibleIds, orderedFilters, visibleFilters, toggleFilter, setFilterOrder } = useFilterConfig();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { isOpen: dropdownOpen, toggle: toggleDropdown } = useDropdown(dropdownRef);
  const { dragOverId, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragReorder((sourceId, targetId) => {
    setFilterOrder((prev) => {
      const next = [...prev];
      const from = next.indexOf(sourceId);
      const to   = next.indexOf(targetId);
      next.splice(from, 1);
      next.splice(to, 0, sourceId);
      return next;
    });
  });

  const handleFilterChange = (id: keyof LeadsFiltersState, value: string) =>
    onFiltersChange({ ...filters, [id]: value });

  const topFilters = visibleFilters.slice(0, 5);
  const rowFilters = visibleFilters.slice(5);
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="mb-6 space-y-3">
      {/* Top row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 min-w-70 items-center gap-2">
          {!isMounted
            ? <Skeleton className="h-9 flex-1" />
            : topFilters.map((f) => <LeadsFilterItem key={f.id} filter={f} filters={filters} onChange={handleFilterChange} />)
          }
        </div>
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {canImport && <LeadsImportButton />}
          {canExport && <LeadsExportButton filters={filters} />}
        </div>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {!isMounted
          ? <Skeleton className="h-9 flex-1" />
          : rowFilters.map((f) => <LeadsFilterItem key={f.id} filter={f} filters={filters} onChange={handleFilterChange} />)
        }

        {/* Manage filters */}
        <div className="relative ml-auto shrink-0 flex items-center gap-2" ref={dropdownRef}>
          <Button variant="ghost" size="md" onClick={() => onFiltersChange(EMPTY_LEADS_FILTERS)} disabled={!hasFilters}>
            {t("clearAll")}
          </Button>
          <Button variant="ghost" size="md" onClick={toggleDropdown} active={dropdownOpen}>
            <SlidersHorizontal />
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 w-52 rounded-md border border-gray-1000 bg-gray-1100 shadow-lg p-1">
              {orderedFilters.map((f) => {
                const isVisible = visibleIds.includes(f.id);
                return (
                  <div
                    key={f.id}
                    draggable
                    onDragStart={() => handleDragStart(f.id)}
                    onDragOver={(e) => handleDragOver(e, f.id)}
                    onDrop={() => handleDrop(f.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "flex items-center gap-1.5 rounded px-2 py-1.5 transition-colors",
                      dragOverId === f.id ? "bg-gray-1000/70" : "hover:bg-gray-1000",
                    )}
                  >
                    <GripVertical className="size-3.5 shrink-0 text-gray-600 cursor-grab active:cursor-grabbing" />
                    <Button
                      variant="plain"
                      size="auto"
                      onClick={() => toggleFilter(f.id)}
                      className={cn("flex-1 justify-start text-sm", isVisible ? "text-gray-900 dark:text-white" : "text-gray-500")}
                    >
                      {f.label}
                    </Button>
                    {isVisible && (
                      <Button variant="plain" size="auto" onClick={() => toggleFilter(f.id)} className="shrink-0 text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <X className="size-3.5" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
