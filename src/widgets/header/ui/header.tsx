"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu } from "lucide-react";
import { formatGMTOffset } from "@/shared/lib/format-gmt-offset";
import { IconClock } from "@/shared/ui/icon";
import { ThemeSwitch } from "./theme-switch";
import { UserMenu } from "./user-menu";
import { LangSwitcher } from "./lang-switcher";
import { navItems } from "../model/nav-items";

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);
  const isDark = resolvedTheme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");
  const t = useTranslations("nav");

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-gray-1100">
      {/* Top bar - Logo, Time, Menu */}
      <nav className="flex min-h-[60px] w-full items-center justify-between px-2 sm:px-4 md:px-6">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center" aria-label="Home">
            <Image
              className="ml-1 w-auto"
              width={131}
              height={50}
              src="/logo.svg"
              alt="logo"
            />
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-gray-900 dark:text-white sm:space-x-4 md:space-x-6">
          <div className="hidden items-center sm:flex">
            <ThemeSwitch
              checked={isDark}
              onCheckedChange={toggleTheme}
              aria-label="Toggle theme"
              mounted={mounted}
            />
          </div>
          <div className="hidden items-center space-x-2 sm:flex">
            <IconClock size={16} className="text-gray-400 mr-4" />
            <span className="text-xs font-bold sm:text-sm">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="hidden text-xs font-medium text-gray-400 md:inline">
              {new Date().toLocaleDateString()}
            </span>
            <span className="hidden text-xs font-medium text-gray-400 lg:inline">
              (GMT{formatGMTOffset()})
            </span>
            <LangSwitcher />
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="p-2 text-gray-900 dark:text-white"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Navigation panel - below header */}
      <nav className=" flex justify-center bg-gray-1200 px-2 py-4 sm:px-4 md:px-6">
        <ul className="flex flex-wrap items-center gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium no-underline hover:text-green-1000 ${isActive ? "text-green-1000" : "text-gray-700 dark:text-white"}`}
              >
                <Icon className="size-5" />
                {t(label as never)}
              </Link>
            </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
