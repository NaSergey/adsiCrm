import { cn } from "@/shared/lib/css";
import type { IconProps } from "./types";

export function IconChevronDown({ className, size }: IconProps) {
  const w = size ?? 14;
  const h = size ? (size * 8) / 14 : 8;
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        d="M1 1L7 7L13 1"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
