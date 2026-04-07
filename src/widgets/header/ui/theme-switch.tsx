"use client";

import { cn } from "@/shared/lib/css";
import { IconMoon, IconSun } from "@/shared/ui/icon";

export interface ThemeSwitchProps {
  /** true = dark (Moon), false = light (Sun) */
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  "aria-label"?: string;
  mounted?: boolean;
}

export function ThemeSwitch({
  checked,
  onCheckedChange,
  className,
  "aria-label": ariaLabel = "Toggle theme",
  mounted = true,
}: ThemeSwitchProps) {
  const handleClick = () => onCheckedChange(!checked);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      suppressHydrationWarning
      className={cn(
        "relative flex h-8 w-[72px] shrink-0 cursor-pointer select-none items-center rounded-full",
        "border border-white/10 bg-gray-1200 shadow-inner",
        "outline-none transition-colors duration-200",
        "hover:border-white/15 focus-visible:ring-2 focus-visible:ring-green-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
        className
      )}
    >
      {/* Thumb: position via CSS variable --theme-thumb-pos (set by html.dark) — no hydration mismatch */}
      <span
        style={{ left: "var(--theme-thumb-pos)" }}
        className={cn(
          "absolute top-1/2 h-5.5 w-5.5 -translate-y-1/2 rounded-full",
          "bg-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.8)]",
          "transition-[left] duration-200 ease-out",
          !mounted && "invisible"
        )}
      />
      {/* Icons: React state after mount (invisible before mount — no hydration mismatch) */}
      <span
        className={cn(
          "absolute left-0 top-0 z-10 flex h-full w-1/2 items-center justify-center transition-[color,filter] duration-200",
          !mounted
            ? "text-white/40"
            : checked
              ? "text-blue-800 drop-shadow-[0_0_8px_rgba(30,64,175,0.9)]"
              : "text-white/90"
        )}
      >
        <IconMoon size={18} />
      </span>
      <span
        className={cn(
          "absolute right-0 top-0 z-10 flex h-full w-1/2 items-center justify-center transition-[color,filter] duration-200",
          !mounted
            ? "text-white/40"
            : !checked
              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]"
              : "text-white/35"
        )}
      >
        <IconSun size={18} />
      </span>
    </button>
  );
}
