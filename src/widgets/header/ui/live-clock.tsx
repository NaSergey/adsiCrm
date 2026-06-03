"use client";

import { useEffect, useState } from "react";
import { IconClock } from "@/shared/ui/icon";
import { formatGMTOffset } from "@/shared/lib/format-gmt-offset";

export function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

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
