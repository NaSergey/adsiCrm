"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium no-underline hover:text-green-1000 ${isActive ? "text-green-1000" : "text-gray-700 dark:text-white"}`}
    >
      {icon}
      {label}
    </Link>
  );
}
