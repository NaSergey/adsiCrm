import { useState, useCallback } from "react";

export function useSelectionMode() {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const toggle = useCallback(() => {
    setIsSelecting((v) => !v);
    setSelectedIds(new Set());
  }, []);

  const exit = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, []);

  const toggleId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { isSelecting, selectedIds, toggle, exit, toggleId };
}
