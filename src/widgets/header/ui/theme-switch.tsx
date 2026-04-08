"use client";

import { useTheme } from "next-themes";
import { cn } from "@/shared/lib/css";
import { IconMoon, IconSun } from "@/shared/ui/icon";

export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      suppressHydrationWarning
      className={cn(
        "relative flex h-8 w-[72px] shrink-0 cursor-pointer select-none items-center rounded-full",
        "border border-white/10 bg-gray-1200 shadow-inner",
        "outline-none transition-colors duration-200",
        "hover:border-white/15 focus-visible:ring-2 focus-visible:ring-green-1000 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1100",
        className
      )}
    >
      <span
        style={{ left: "var(--theme-thumb-pos)" }}
        className={cn(
          "absolute top-1/2 h-5.5 w-5.5 -translate-y-1/2 rounded-full",
          "bg-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.8)]",
          "transition-[left] duration-200 ease-out",
        )}
      />
      {/* Moon — активен в тёмной теме */}
      <span className="absolute left-0 top-0 z-10 flex h-full w-1/2 items-center justify-center transition-[color,filter] duration-200 text-white/90 dark:text-blue-800 dark:drop-shadow-[0_0_8px_rgba(30,64,175,0.9)]">
        <IconMoon size={18} />
      </span>
      {/* Sun — активен в светлой теме */}
      <span className="absolute right-0 top-0 z-10 flex h-full w-1/2 items-center justify-center transition-[color,filter] duration-200 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.9)] dark:text-white/35 dark:drop-shadow-none">
        <IconSun size={18} />
      </span>
    </button>
  );
}
