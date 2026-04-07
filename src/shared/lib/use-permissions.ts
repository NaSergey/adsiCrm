import { getAccessToken, getTokenUser } from "@/shared/lib/auth-token";
import { PERMISSIONS, type Feature, type Role } from "@/shared/config/permissions";

function getPermissions(role: string) {
  return PERMISSIONS[role as Role] ?? { pages: [], features: [] };
}

export function usePermissions() {
  const token = getAccessToken();
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role;
  const perms = getPermissions(role);

  return {
    role,
    canAccessPage: (href: string) => perms.pages.includes(href),
    hasFeature: (feature: Feature) => perms.features.includes(feature),
    allowedPages: perms.pages,
  };
}
