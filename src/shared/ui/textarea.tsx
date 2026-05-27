"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  wrapperClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, wrapperClassName, ...props }, ref) => (
    <div className={label ? cn("flex w-full flex-col gap-1.5", wrapperClassName) : "contents"}>
      {label && <span className="text-xs font-medium text-gray-500">{label}</span>}
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md bg-gray-200 dark:bg-gray-1000 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 outline-none transition-colors focus:ring-2 focus:ring-transparent focus:ring-offset-2 focus:ring-offset-blue-600 disabled:opacity-50 resize-none",
          className
        )}
        {...props}
      />
    </div>
  )
);

Textarea.displayName = "Textarea";

export { Textarea };
