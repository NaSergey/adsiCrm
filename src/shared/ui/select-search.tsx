"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";
import { IconChevronDown } from "@/shared/ui/icon";

export interface SelectSearchOption {
  value: string;
  label: string;
}

export interface SelectSearchProps {
  options: SelectSearchOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}

export function SelectSearch({ options, placeholder, value, onChange, label, className, disabled, error }: SelectSearchProps) {
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleFocus = () => {
    setSearch("");
    setIsOpen(true);
  };

  const handleSelect = (opt: SelectSearchOption) => {
    onChange?.(opt.value);
    setSearch(opt.label);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.("");
    setSearch("");
  };

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setSearch(selectedLabel);
    }
  };

  // Sync displayed text when value changes externally
  React.useEffect(() => {
    setSearch(selectedLabel);
  }, [selectedLabel]);

  return (
    <div
      ref={containerRef}
      onBlur={handleBlur}
      className={cn(label ? "flex flex-col gap-1.5 w-full" : "relative inline-block min-w-30", className)}
    >
      {label && (
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-500">{label}</span>
          {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
      )}
      <div className="relative">
        <input
          type="text"
          value={search}
          onFocus={handleFocus}
          onClick={() => { setSearch(""); setIsOpen(true); }}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          placeholder={placeholder}
          disabled={disabled}
          className="h-9 w-full cursor-pointer rounded-md bg-gray-200 dark:bg-gray-1000 pl-3 pr-9 py-1.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6F767E]">
          <IconChevronDown />
        </span>

        {isOpen && (
          <div className="absolute top-full mt-1 w-full z-50 rounded-md bg-gray-100 dark:bg-gray-1100 shadow-lg overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">No results</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  onMouseDown={(e) => { e.preventDefault(); handleSelect(opt); }}
                  className={cn(
                    "w-full px-3 py-2 text-left cursor-pointer text-sm transition-colors",
                    value === opt.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-1000"
                  )}
                >
                  {opt.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
