import { useState, useCallback } from "react";

const PINNED_KEY = "pinned_campaigns";

function load(): Set<number> {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return new Set(raw ? (JSON.parse(raw) as number[]) : []);
  } catch {
    return new Set();
  }
}

export function usePinnedCampaigns() {
  const [pinned, setPinned] = useState<Set<number>>(() => load());

  const toggle = useCallback((id: number) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(PINNED_KEY, JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { pinned, toggle };
}
