"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { clearAccessToken, getAccessToken, getTokenUser } from "@/shared/lib/auth-token";

const menuItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Shield, label: "Security", href: "/security" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api";

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    setUser(getTokenUser(getAccessToken() ?? ""));
  }, []);

  async function handleLogout() {
    await fetch(`${API_URL}/auth/logout`, { method: "GET", credentials: "include" });
    clearAccessToken();
    router.push("/");
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => document.addEventListener("mousedown", onOutside), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onOutside);
      clearTimeout(t);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-1000 text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
        aria-label="User menu"
        aria-expanded={open}
      >
        <User className="size-4" />
      </button>

      {/* Side panel — slides in from the right edge of the screen */}
      <div
        className={`fixed top-15 right-0 z-50 w-64 rounded-bl-lg border-l border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-1100 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User info */}
        <div className="flex items-center gap-2.5 px-3 py-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-1000">
            <User className="size-4 text-gray-900 dark:text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-gray-900 dark:text-white">{user?.name ?? "—"}</p>
            <p className="truncate text-xs text-gray-500">{user?.email ?? "—"}</p>
          </div>
        </div>

        {/* Items */}
        <div className="py-1">
          {menuItems.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-1000 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Icon className="size-3.5 shrink-0" />
              {label}
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="border-t border-gray-100 dark:border-gray-800 py-1">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5 shrink-0" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
