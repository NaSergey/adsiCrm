"use client";

import * as React from "react";
import { cn } from "@/shared/lib/css";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      type = "button",
      role = "switch",
      "aria-checked": ariaChecked = checked,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isOn = isControlled ? checked : uncontrolled;

    const handleClick = () => {
      if (disabled) return;
      const next = !isOn;
      if (!isControlled) setUncontrolled(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        ref={ref}
        type={type}
        role={role}
        aria-checked={isOn}
        data-slot="switch"
        disabled={disabled}
        onClick={handleClick}
        className={cn(
          "inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100 disabled:cursor-not-allowed disabled:opacity-50",
          isOn ? "bg-green-1000" : "bg-gray-1200",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none h-4 w-4 rounded-full bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),0_1px_2px_0_rgba(0,0,0,0.1)] transition-transform",
            isOn ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
