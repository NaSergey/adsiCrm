import { type LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/css";

interface StatCardProps {
  label: string;
  value: number | string;
  subValue?: number | string;
  icon: LucideIcon;
  onClick?: () => void;
  active?: boolean;
}

export function Card({ label, value, subValue, icon: Icon, onClick, active }: StatCardProps) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      onClick={onClick}
      className={cn(
        "flex h-full w-full items-center gap-2 rounded-xl px-2 py-1.5 transition-colors",
        active
          ? "bg-green-1000/15 ring-1 ring-green-1000/40"
          : "bg-gray-1000",
        onClick && !active && "hover:bg-gray-900 cursor-pointer",
        onClick && "group",
      )}
    >
      <div className={cn(
        "h-8 w-8 shrink-0 rounded-lg flex items-center justify-center transition-colors",
        active ? "bg-green-1000/20" : "bg-gray-1200",
      )}>
        <Icon className={cn(
          "size-4 transition-colors",
          active ? "text-green-1000" : "text-gray-700 dark:text-gray-300",
          onClick && !active && "group-hover:text-gray-200",
        )} />
      </div>
      <div className="min-w-0">
        <p className={cn(
          "truncate text-xs font-semibold leading-tight transition-colors",
          active ? "text-green-1000" : "text-gray-900 dark:text-white",
        )}>{label}</p>
        <div className={cn(
          "flex items-center gap-1 transition-colors",
          active ? "text-green-1000" : "text-gray-700 dark:text-gray-300",
        )}>
          <span className="text-xs">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          {subValue !== undefined && (
            <span className="text-xs text-gray-600 dark:text-gray-400">· {subValue}</span>
          )}
        </div>
      </div>
      {onClick && (
        <div className={cn(
          "ml-auto shrink-0 w-1.5 h-1.5 rounded-full transition-colors",
          active ? "bg-green-1000" : "bg-gray-600 group-hover:bg-gray-400",
        )} />
      )}
    </Tag>
  );
}
