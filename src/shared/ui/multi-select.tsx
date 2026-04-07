"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/css";
import { IconChevronDown } from "@/shared/ui/icon";
import type { SelectSearchOption } from "./select-search";

interface MultiSelectProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectSearchOption[];
  placeholder?: string;
  className?: string;
}

export function MultiSelect({ label, value, onChange, options, placeholder, className }: MultiSelectProps) {
  const [search, setSearch] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = options.filter(
    (o) => !value.includes(o.value) && o.label.toLowerCase().includes(search.toLowerCase())
  );

  const add = (v: string) => {
    onChange([...value, v]);
    setSearch("");
    inputRef.current?.focus();
  };

  const remove = (v: string) => onChange(value.filter((item) => item !== v));

  const handleBlur = (e: React.FocusEvent) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setSearch("");
    }
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  return (
    <div ref={containerRef} onBlur={handleBlur} className={cn("flex flex-col gap-1.5 w-full", className)}>
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
      <div className="relative">
        <div
          className="flex flex-wrap items-center gap-1 min-h-9 w-full cursor-text rounded-md bg-gray-200 dark:bg-gray-1000 px-2 py-1 pr-8 text-sm outline-none"
          onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
        >
          {selectedLabels.map((label, i) => (
            <span key={value[i]} className="flex items-center gap-1 cursor-pointer rounded bg-gray-300 dark:bg-gray-900 px-1.5 py-0.5 text-xs text-gray-900 dark:text-white">
              {label}
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); remove(value[i]); }}
                className="text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-16 bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 outline-none text-sm"
          />
        </div>
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
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); add(opt.value); }}
                  className="w-full px-3 py-2 text-left cursor-pointer text-sm text-gray-900 dark:text-white hover:bg-gray-1000 transition-colors"
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
