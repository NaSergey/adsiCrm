"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/css";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  "data-slot"?: string;
  label?: string;
  type?: string;
  error?: string;
  noIcon?: boolean;
}

const autofillCls =
  "[&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]";

const focusCls =
  "focus-within:ring-2 focus-within:ring-transparent focus-within:ring-offset-2 focus-within:ring-offset-blue-600";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, type = "text", readOnly, disabled, error, noIcon, ...props }, ref) => {
    const isInactive = readOnly || disabled;

    return (
      /* When no label: `contents` makes this div invisible in box model — label becomes the flex item */
      <div className={label ? "flex w-full flex-col gap-1.5" : "contents"}>
        {label && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
        )}
        <label
          className={cn(
            "flex items-center gap-2 rounded-md px-3 h-9 text-sm outline-none transition-colors",
            label
              ? cn("w-full", isInactive ? "bg-gray-100 dark:bg-gray-1000/40 cursor-not-allowed" : cn("bg-gray-200 dark:bg-gray-1000", focusCls))
              : cn("flex-1 bg-gray-200 dark:bg-gray-1000", focusCls, className)
          )}
          data-slot="input-wrapper"
        >
          {!label && !noIcon && <Search className="size-4 shrink-0 text-[#6F767E]" />}
          <input
            ref={ref}
            type={type}
            readOnly={readOnly}
            disabled={disabled}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-gray-500 text-sm",
              isInactive ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" : "text-gray-900 dark:text-white",
              autofillCls
            )}
            data-slot="input"
            {...props}
          />
        </label>
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
