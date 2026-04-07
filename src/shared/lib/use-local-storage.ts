"use client";

import * as React from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = React.useState<T>(defaultValue);
  const [isMounted, setIsMounted] = React.useState(false);

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
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, isMounted]);

  return [value, setValue, isMounted] as const;
}
