import { useSyncExternalStore } from "react";
import { getAccessToken, getTokenUser } from "@/shared/lib/auth-token";
import { PERMISSIONS, JWT_PERMISSION_GATES, GATED_FEATURES, type Feature, type Role } from "@/shared/config/permissions";

function resolveFeatures(role: Role | "", roleFeatures: Feature[], jwtPermissions: string[]): Feature[] {
  if (role === "ADMIN") return roleFeatures;
  const base = roleFeatures.filter((f) => !GATED_FEATURES.has(f));
  const unlocked = Object.entries(JWT_PERMISSION_GATES)
    .filter(([perm]) => jwtPermissions.includes(perm))
    .flatMap(([, features]) => features);
  return [...base, ...unlocked];
}

// Permissions don't change during a session — no external store to subscribe to
function subscribe(_cb: () => void) {
  return () => {};
}

export function usePermissions() {
  // useSyncExternalStore ensures server snapshot (null) matches initial client render,
  // then React synchronously updates with the real token after hydration — no mismatch.
  const token = useSyncExternalStore(subscribe, getAccessToken, () => null);
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role;
  const rolePerms = PERMISSIONS[role] ?? { pages: [], features: [] };
  const features = resolveFeatures(role, rolePerms.features, user?.permissions ?? []);

  return {
    role,
    canAccessPage: (href: string) => rolePerms.pages.includes(href),
    hasFeature: (feature: Feature) => features.includes(feature),
    allowedPages: rolePerms.pages,
  };
}
