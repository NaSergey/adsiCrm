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

const wrapperBase = "flex items-center gap-2 rounded-md px-3 h-9 text-sm outline-none transition-colors";
const wrapperActive = cn("bg-gray-200 dark:bg-gray-1000", focusCls);
const wrapperInactive = "bg-gray-100 dark:bg-gray-1000/90 cursor-not-allowed opacity-60";

const inputActive = "text-gray-900 dark:text-white";
const inputInactive = "text-gray-400 dark:text-gray-500 cursor-not-allowed";

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
            wrapperBase,
            label ? "w-full" : cn("flex-1", className),
            isInactive ? wrapperInactive : wrapperActive,
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
              "flex-1 min-w-0 bg-transparent outline-none placeholder:text-gray-500 text-sm",
              isInactive ? inputInactive : inputActive,
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
