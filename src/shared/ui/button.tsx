"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";

const buttonVariants = {
  variant: {
    default:
      "bg-green-1000 text-white hover:bg-green-1000/90 focus-visible:ring-2 focus-visible:ring-green-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    secondary:
      "bg-gray-1000 text-gray-900 dark:text-white hover:bg-gray-1000/90 focus-visible:ring-2 focus-visible:ring-gray-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    outline:
      "border border-gray-1000 bg-transparent text-gray-900 dark:text-white hover:bg-gray-1000/20 focus-visible:ring-2 focus-visible:ring-gray-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    ghost:
      "border border-transparent text-gray-900 dark:text-white hover:bg-gray-1000/50 focus-visible:ring-2 focus-visible:ring-gray-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    ghostActive:
      "border border-gray-1000 bg-gray-1000/50 text-gray-900 dark:text-white hover:bg-gray-1000/70 focus-visible:ring-2 focus-visible:ring-gray-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    destructive:
      "bg-red-600 text-white hover:bg-red-600/90 focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    black:
      "bg-black text-white hover:bg-gray-900 focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    blue:
      "bg-blue-700 text-white hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
    plain: "",
  },
  size: {
    sm:   "h-8 rounded px-3 text-xs font-medium",
    md:   "h-9 rounded-md px-4 text-sm font-medium",
    lg:   "h-10 rounded-md px-6 text-sm font-medium",
    auto: "",
  },
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  /** When true (e.g. filters selected), ghost button gets border and background */
  active?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      active,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const variantKey =
      variant === "ghost" && active ? "ghostActive" : variant;
    return (
      <button
        ref={ref}
        type={type}
        data-slot="button"
        data-active={active}
        disabled={disabled}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap outline-none transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
          buttonVariants.variant[variantKey],
          buttonVariants.size[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
