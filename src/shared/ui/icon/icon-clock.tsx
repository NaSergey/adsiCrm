import { cn } from "@/shared/lib/css";
import type { IconProps } from "./types";

export function IconClock({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM11 5C11 4.44772 10.5523 4 10 4C9.44771 4 9 4.44772 9 5V9.58579C9 10.1162 9.21071 10.6249 9.58579 11L11.7929 13.2071C12.1834 13.5976 12.8166 13.5976 13.2071 13.2071C13.5976 12.8166 13.5976 12.1834 13.2071 11.7929L11 9.58579V5Z"
        fill="currentColor"
      />
    </svg>
  );
}
