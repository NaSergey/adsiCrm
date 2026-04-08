"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { useDeleteLead } from "@/entities/api/delete/use-delete-lead";

interface LeadsSelectionState {
  isSelecting: boolean;
  selectedIds: Set<number>;
  isDeleting: boolean;
  toggleId: (id: number) => void;
  startSelect: () => void;
  exitSelect: () => void;
  deleteSelected: () => void;
}

const LeadsSelectionContext = createContext<LeadsSelectionState | null>(null);

export function LeadsSelectionProvider({ children }: { children: ReactNode }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { remove, isPending: isDeleting } = useDeleteLead({
    onSuccess: () => {
      setSelectedIds(new Set());
      setIsSelecting(false);
    },
  });

  const toggleId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const startSelect = useCallback(() => setIsSelecting(true), []);

  const exitSelect = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, []);

  const deleteSelected = useCallback(() => {
    remove(Array.from(selectedIds));
  }, [remove]);

  return (
    <LeadsSelectionContext.Provider
      value={{ isSelecting, selectedIds, isDeleting, toggleId, startSelect, exitSelect, deleteSelected }}
    >
      {children}
    </LeadsSelectionContext.Provider>
  );
}

export function useLeadsSelection() {
  const ctx = useContext(LeadsSelectionContext);
  if (!ctx) throw new Error("useLeadsSelection must be used within LeadsSelectionProvider");
  return ctx;
}
