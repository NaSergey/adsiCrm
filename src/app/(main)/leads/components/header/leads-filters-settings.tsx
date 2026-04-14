"use client";

import * as React from "react";
import { SlidersHorizontal, X, GripVertical } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/css";
import { useFilterConfig } from "./use-filter-config";
import { useDragReorder } from "./use-drag-reorder";
import { useDropdown } from "./use-dropdown";

export function LeadsFiltersSettings() {
  const { orderedFilters, visibleIds, toggleFilter, setFilterOrder } = useFilterConfig();
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

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="secondary" size="sm" onClick={toggleDropdown} active={dropdownOpen}>
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
  );
}
