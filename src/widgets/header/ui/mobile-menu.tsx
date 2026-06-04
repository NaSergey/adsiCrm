"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Menu, X, User, Settings, LogOut, Shield, ScrollText } from "lucide-react";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { clearAccessToken, getAccessToken, getTokenUser } from "@/shared/lib/auth-token";
import { setLocale } from "@/shared/lib/set-locale";
import { TabSwitcher } from "@/shared/ui/tab-switcher";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UK" },
];

interface MobileNavItem {
  href: string;
  icon: ReactNode;
  label: string;
}

const userMenuItems = [
  { icon: ScrollText, label: "Logs", href: "/logs" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function MobileMenu({ navItems }: { navItems: MobileNavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleLangSelect(code: string) {
    startTransition(async () => {
      await setLocale(code);
      router.refresh();
    });
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setUser(getTokenUser(getAccessToken() ?? "")); }, []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleLogout() {
    clearAccessToken();
    try {
      await fetch("/api/auth/logout", { method: "GET", credentials: "include" });
    } catch {
      // Ignore network errors — local tokens are already cleared
    }
    window.location.href = "/";
  }

  return (
    <>
      {/* Hamburger trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 text-gray-900 dark:text-white"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu size={20} />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-in drawer */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-72 flex-col bg-gray-1100 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-gray-1000 px-4 py-3">
          <span className="text-sm font-semibold text-white">Menu</span>
          <div className="flex items-center gap-1">
            <ThemeSwitch />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1 text-gray-400 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* User info */}
        <div className="flex items-center gap-3 border-b border-gray-1000 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-1000">
            <User className="size-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name ?? "—"}</p>
            <p className="truncate text-xs text-gray-500">{user?.email ?? "—"}</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-0.5 px-2">
            {navItems.map(({ href, icon, label }) => {
              const isActive =
                pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-gray-1000 text-green-1000"
                        : "text-gray-300 hover:bg-gray-1000 hover:text-white"
                    }`}
                  >
                    {icon}
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User account links */}
        <div className="border-t border-gray-1000 px-2 py-2">
          {userMenuItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-1000 hover:text-white transition-colors"
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="size-4 shrink-0" />
            Log out
          </button>
        </div>

        {/* Language */}
        <div className="border-t border-gray-1000 px-4 py-3">
          <p className="mb-1.5 text-xs font-medium text-gray-400">Language</p>
          <TabSwitcher
            tabs={LOCALES.map(({ code, label }) => ({ id: code, label }))}
            activeTab={locale}
            onTabChange={handleLangSelect}
            className="w-full"
            itemClassName="flex-1 px-2 py-1 text-xs"
          />
        </div>

      </div>
    </>
  );
}
