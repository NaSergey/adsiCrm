import { cn } from "@/shared/lib/css";
import { iconBaseProps, type IconProps } from "../types";

export function IconSend({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      {...iconBaseProps}
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M3.4 20.4 20.85 12.92a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .65.65 1.1 1.39.91Z"
        fill="currentColor"
      />
    </svg>
  );
}
