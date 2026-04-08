import { cn } from "@/shared/lib/css";
import type { IconProps } from "./types";

export function IconMoon({ className, size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7691 15.3748C21.1118 14.5794 20.366 13.8162 19.5 13.8162C14.5294 13.8162 10.5 9.78675 10.5 4.81619C10.5 3.95014 9.73674 3.20436 8.9414 3.54709C5.74067 4.92636 3.5 8.1096 3.5 11.8162C3.5 16.7867 7.52944 20.8162 12.5 20.8162C16.2066 20.8162 19.3898 18.5755 20.7691 15.3748Z"
        fill="currentColor"
      />
    </svg>
  );
}
