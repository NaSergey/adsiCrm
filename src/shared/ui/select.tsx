"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";
import { IconChevronDown } from "@/shared/ui/icon";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  options: SelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  "data-slot"?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      className,
      options,
      placeholder,
      value,
      onChange,
      label,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
    };

    const handleBlur = (e: React.FocusEvent) => {
      if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
        setIsOpen(false);
      }
    };

    // Separate flex classes from other styling classes
    const flexClasses = className ? className.split(" ").filter(c => c.includes("flex") || c === "w-full" || c.startsWith("w-") || c.startsWith("min-") || c === "shrink-0").join(" ") : "";
    const otherClasses = className ? className.split(" ").filter(c => !c.includes("flex") && c !== "w-full" && !c.startsWith("w-") && !c.startsWith("min-") && c !== "shrink-0").join(" ") : "";

    return (
      <div
        className={cn(
          label ? "flex flex-col gap-1.5 w-full" : "relative inline-block min-w-[120px]",
          flexClasses
        )}
        onBlur={handleBlur}
        data-slot="select-wrapper"
      >
        {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
        <div className="relative">
          <button
            ref={ref}
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn("h-9 w-full cursor-pointer rounded-md bg-gray-200 dark:bg-gray-1000 pl-3 pr-9 py-1.5 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-blue-600 disabled:cursor-not-allowed disabled:opacity-50 text-left", otherClasses)}
            data-slot="select"
            {...props}
          >
            <span className={selectedLabel ? "text-gray-900 dark:text-white" : "text-gray-500"}>
              {selectedLabel || placeholder}
            </span>
          </button>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6F767E]">
            <IconChevronDown />
          </span>

          {isOpen && (
            <div className="absolute top-full mt-1 w-full z-50 rounded-md bg-gray-100 dark:bg-gray-1100 shadow-lg overflow-hidden max-h-48 overflow-y-auto">

              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "w-full cursor-pointer px-3 py-2 text-left text-sm transition-colors",
                    value === opt.value
                      ? "bg-blue-600 text-white"
                      : "text-gray-900 dark:text-white hover:bg-gray-1000"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
