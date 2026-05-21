import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { formatGMTOffset } from "@/shared/lib/format-gmt-offset";
import { IconClock } from "@/shared/ui/icon";
import { ThemeSwitch } from "./theme-switch";
import { UserMenu } from "./user-menu";
import { navItems } from "../model/nav-items";
import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { NavLink } from "./nav-link";
import { Logo } from "@/shared/ui/logo";
import { MobileMenu } from "./mobile-menu";
// ... ваши импорты

export async function Header() {
  const { pages } = await getServerPermissions();
  const t = await getTranslations("nav");

  const visibleNavItems = navItems.filter(item => pages.includes(item.href));

  const mobileNavItems = visibleNavItems.map(({ href, icon: Icon, label }) => ({
    href,
    icon: <Icon className="size-5" />,
    label: t(label as never),
  }));

  return (
    /* МЕНЯЕМ ТУТ: 
       - fixed: фиксирует элемент относительно окна браузера
       - top-0: прижимает к самому верху
       - left-0 right-0: растягивает на всю ширину
       - z-50: чтобы был поверх контента
    */
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-1100">
      <nav className="flex h-15 w-full items-center justify-between px-2 sm:px-4 md:px-6">
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
          </div>

          <div className="md:hidden">
            <MobileMenu navItems={mobileNavItems} />
          </div>

          <div className="hidden md:block">
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Эта часть видна только на десктопе, она тоже будет зафиксирована */}
      <nav className="hidden justify-center bg-background px-2 py-4 sm:px-4 md:flex md:px-6">
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