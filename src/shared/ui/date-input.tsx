"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";

export interface DateInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  "data-slot"?: string;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="date"
        className={cn(
          "h-9 rounded-md bg-gray-200 dark:bg-gray-1000 px-3 text-sm text-gray-900 dark:text-white outline-none transition-colors focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-blue-600 placeholder:text-gray-500",
          className
        )}
        data-slot="date-input"
        {...props}
      />
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
