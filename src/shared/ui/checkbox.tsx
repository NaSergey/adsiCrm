"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className={cn("flex items-center gap-2 cursor-pointer select-none", className)}>
      <input
        ref={ref}
        type="checkbox"
        className="h-4 w-4 rounded accent-blue-600 cursor-pointer"
        {...props}
      />
      <span className="text-xs text-gray-500">{label}</span>
    </label>
  )
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
