"use client";

import { cn } from "@/shared/lib/css";

export interface TabSwitcherItem<T extends string = string> {
  id: T;
  label: string;
}

interface TabSwitcherProps<T extends string = string> {
  tabs: TabSwitcherItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
  itemClassName?: string;
}

export function TabSwitcher<T extends string = string>({
  tabs,
  activeTab,
  onTabChange,
  className,
  itemClassName,
}: TabSwitcherProps<T>) {
  return (
    <div className={cn("flex rounded-lg border border-gray-1000 bg-gray-1200 p-0.5", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-md px-4 py-2 cursor-pointer text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-gray-1000 text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
            itemClassName,
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
