"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useDeletePartner } from "@/entities/api/delete/use-delete-partner";
import { useDeleteBroker } from "@/entities/api/delete/use-delete-broker";
import { useAppToast } from "@/shared/lib/use-app-toast";
import type { AffiliateTab } from "./types";

interface AffiliatesSelectionState {
  isSelecting: boolean;
  selectedIds: Set<number>;
  isDeleting: boolean;
  toggleId: (id: number) => void;
  startSelect: () => void;
  exitSelect: () => void;
  deleteSelected: () => void;
}

const AffiliatesSelectionContext = createContext<AffiliatesSelectionState | null>(null);

interface AffiliatesSelectionProviderProps {
  activeTab: AffiliateTab;
  children: ReactNode;
}

export function AffiliatesSelectionProvider({ activeTab, children }: AffiliatesSelectionProviderProps) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const exitSelect = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, []);

  // Reset on tab switch
  useEffect(() => {
    exitSelect();
  }, [activeTab, exitSelect]);

  const appToast = useAppToast();
  const { remove: deletePartners, isPending: isDeletingPartners } = useDeletePartner({ onSuccess: () => { exitSelect(); appToast.deleted("partner"); } });
  const { remove: deleteBrokers, isPending: isDeletingBrokers } = useDeleteBroker({ onSuccess: () => { exitSelect(); appToast.deleted("broker"); } });

  const toggleId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const startSelect = useCallback(() => setIsSelecting(true), []);

  const deleteSelected = useCallback(() => {
    const ids = Array.from(selectedIds);
    if (activeTab === "partners") deletePartners(ids);
    else deleteBrokers(ids);
  }, [activeTab, selectedIds, deletePartners, deleteBrokers]);

  return (
    <AffiliatesSelectionContext.Provider
      value={{
        isSelecting,
        selectedIds,
        isDeleting: isDeletingPartners || isDeletingBrokers,
        toggleId,
        startSelect,
        exitSelect,
        deleteSelected,
      }}
    >
      {children}
    </AffiliatesSelectionContext.Provider>
  );
}

export function useAffiliatesSelection() {
  const ctx = useContext(AffiliatesSelectionContext);
  if (!ctx) throw new Error("useAffiliatesSelection must be used within AffiliatesSelectionProvider");
  return ctx;
}
