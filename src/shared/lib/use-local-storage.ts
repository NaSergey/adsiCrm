"use client";

import * as React from "react";

const LS_SYNC_EVENT = "ls-sync";

interface LsSyncDetail {
  key: string;
  value: string;
  sourceId: number;
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [isMounted, setIsMounted] = React.useState(false);
  const sourceId = React.useRef(Math.random());

  // After mount, sync from localStorage (runs only on client, after SSR)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    } catch {}
    setIsMounted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  React.useEffect(() => {
    if (!isMounted) return;
    try {
      const serialized = JSON.stringify(value);
      // Skip if localStorage already has this exact value — prevents cross-instance ping-pong
      if (localStorage.getItem(key) === serialized) return;
      localStorage.setItem(key, serialized);
      window.dispatchEvent(
        new CustomEvent<LsSyncDetail>(LS_SYNC_EVENT, {
          detail: { key, value: serialized, sourceId: sourceId.current },
        })
      );
    } catch {}
  }, [key, value, isMounted]);

  React.useEffect(() => {
    const handleSync = (e: CustomEvent<LsSyncDetail>) => {
      if (e.detail.key !== key) return;
      if (e.detail.sourceId === sourceId.current) return; // ignore self
      try {
        setValue(JSON.parse(e.detail.value) as T);
      } catch {}
    };
    window.addEventListener(LS_SYNC_EVENT, handleSync as EventListener);
    return () => window.removeEventListener(LS_SYNC_EVENT, handleSync as EventListener);
  }, [key]);

  return [value, setValue, isMounted] as const;
}
