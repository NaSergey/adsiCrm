import type React from "react";
import type { LucideIcon } from "lucide-react";
import {
  IconHome,
  IconUsers,
  IconCrown,
  IconChartBar,
  IconArmchair,
  IconUserCircle,
  IconCompass,
  IconShieldHeart,
  IconSend,
} from "@/shared/ui/icon";

export interface NavItem {
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  label: string;
}

export const navItems: NavItem[] = [
  // { href: "/dasboard", icon: IconHome, label: "dashboard" },
  { href: "/campaign", icon: IconUsers, label: "campaign" },
  { href: "/leads", icon: IconShieldHeart, label: "leads" },
  { href: "/affiliates", icon: IconArmchair, label: "affiliates" },
  { href: "/senderLead", icon: IconSend, label: "senderLead" },
  // { href: "/logs", icon: IconChartBar, label: "logs" },
  // { href: "/report", icon: IconCalendarCheck, label: "report" },
  // { href: "/service", icon: IconCrown, label: "service" },
  { href: "/users", icon: IconUserCircle, label: "users" },
  { href: "/wiki", icon: IconCompass, label: "wiki" },
];
