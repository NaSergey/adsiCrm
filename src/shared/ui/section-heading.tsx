"use client";

import { cn } from "@/shared/lib/css";

interface SectionHeadingProps {
  title: string;
  className?: string;
}

export function SectionHeading({ title, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="inline-block h-6 w-4 shrink-0 rounded-md bg-blue-400" />
      <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
    </div>
  );
}
