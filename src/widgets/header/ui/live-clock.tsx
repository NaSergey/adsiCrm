"use client";

import { useSyncExternalStore } from "react";
import { IconClock } from "@/shared/ui/icon";
import { formatGMTOffset } from "@/shared/lib/format-gmt-offset";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000);
  return () => clearInterval(id);
}

// Bucket to whole seconds so React only re-renders once per tick.
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = (): number | null => null;

export function LiveClock() {
  const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (seconds === null) return null;

  const now = new Date(seconds * 1000);

  return (
    <div className="hidden items-center space-x-2 sm:flex">
      <IconClock size={16} className="text-gray-400 mr-4" />
      <span className="text-xs font-bold sm:text-sm">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </span>
      <span className="hidden text-xs font-medium text-gray-400 md:inline">
        {now.toLocaleDateString()}
      </span>
      <span className="hidden text-xs font-medium text-gray-400 lg:inline">
        {`(GMT${formatGMTOffset()})`}
      </span>
    </div>
  );
}
