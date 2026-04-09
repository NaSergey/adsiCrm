import { getAccessToken, getTokenUser } from "@/shared/lib/auth-token";
import { PERMISSIONS, JWT_PERMISSION_GATES, GATED_FEATURES, type Feature, type Role } from "@/shared/config/permissions";

function resolveFeatures(roleFeatures: Feature[], jwtPermissions: string[]): Feature[] {
  const base = roleFeatures.filter((f) => !GATED_FEATURES.has(f));
  const unlocked = Object.entries(JWT_PERMISSION_GATES)
    .filter(([perm]) => jwtPermissions.includes(perm))
    .flatMap(([, features]) => features);
  return [...base, ...unlocked];
}

export function usePermissions() {
  const token = getAccessToken();
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role;
  const rolePerms = PERMISSIONS[role] ?? { pages: [], features: [] };
  const features = resolveFeatures(rolePerms.features, user?.permissions ?? []);

  return {
    role,
    canAccessPage: (href: string) => rolePerms.pages.includes(href),
    hasFeature: (feature: Feature) => features.includes(feature),
    allowedPages: rolePerms.pages,
  };
}
