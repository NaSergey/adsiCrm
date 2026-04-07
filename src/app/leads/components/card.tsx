import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: number | string;
  icon: LucideIcon;
}

export function Card({ label, value, subValue, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-1000 px-2 py-1.5">
      <div className="h-8 w-8 shrink-0 rounded-lg bg-gray-1200 flex items-center justify-center">
        <Icon className="size-4 text-gray-600 dark:text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-gray-900 dark:text-white leading-tight">{label}</p>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-500">
          <span className="text-xs">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {subValue !== undefined && (
            <span className="text-xs text-gray-500 dark:text-gray-600">· {subValue}</span>
          )}
        </div>
      </div>
    </div>
  );
}
