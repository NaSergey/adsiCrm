import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Menu } from "lucide-react";
import { formatGMTOffset } from "@/shared/lib/format-gmt-offset";
import { IconClock } from "@/shared/ui/icon";
import { ThemeSwitch } from "./theme-switch";
import { UserMenu } from "./user-menu";
import { LangSwitcher } from "./lang-switcher";
import { navItems } from "../model/nav-items";
import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { NavLink } from "./nav-link";
import { Logo } from "@/shared/ui/logo";

export async function Header() {
  const { pages } = await getServerPermissions();
  const t = await getTranslations("nav");

  const visibleNavItems = navItems.filter(item => pages.includes(item.href));

  return (
    <header className="fixed left-0 right-0 top-0 z-50 bg-gray-1100">
      <nav className="flex min-h-15 w-full items-center justify-between px-2 sm:px-4 md:px-6">
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center" aria-label="Home">
            <Logo size="md" />
          </Link>
        </div>

        <div className="flex items-center space-x-2 text-gray-900 dark:text-white sm:space-x-4 md:space-x-6">
          <div className="hidden items-center sm:flex">
            <ThemeSwitch />
          </div>
          <div className="hidden items-center space-x-2 sm:flex">
            <IconClock size={16} className="text-gray-400 mr-4" />
            <span suppressHydrationWarning className="text-xs font-bold sm:text-sm">
              {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            <span suppressHydrationWarning className="hidden text-xs font-medium text-gray-400 md:inline">
              {new Date().toLocaleDateString()}
            </span>
            <span suppressHydrationWarning className="hidden text-xs font-medium text-gray-400 lg:inline">
              {`(GMT${formatGMTOffset()})`}
            </span>
            <LangSwitcher />
          </div>

          <div className="md:hidden">
            <button type="button" className="p-2 text-gray-900 dark:text-white" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>

          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </nav>

      <nav className="flex justify-center bg-gray-1200 px-2 py-4 sm:px-4 md:px-6">
        <ul className="flex flex-wrap items-center gap-1">
          {visibleNavItems.map(({ href, icon: Icon, label }) => (
            <li key={href}>
              <NavLink href={href} icon={<Icon className="size-5" />} label={t(label as never)} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
