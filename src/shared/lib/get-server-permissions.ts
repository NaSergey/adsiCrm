import { cookies } from "next/headers";
import { getTokenUser } from "./auth-token";
import { PERMISSIONS, JWT_PERMISSION_GATES, GATED_FEATURES, type Role, type Feature } from "@/shared/config/permissions";

const ACCESS_TOKEN_KEY = "pixelcrm_access_token";

export interface ServerPermissions {
  role: Role | "";
  pages: string[];
  features: Feature[];
}

function resolveFeatures(role: Role | "", roleFeatures: Feature[], jwtPermissions: string[]): Feature[] {
  if (role === "ADMIN") return roleFeatures;
  const base = roleFeatures.filter((f) => !GATED_FEATURES.has(f));
  const unlocked = Object.entries(JWT_PERMISSION_GATES)
    .filter(([perm]) => jwtPermissions.includes(perm))
    .flatMap(([, features]) => features);
  return [...base, ...unlocked];
}

export async function getServerPermissions(): Promise<ServerPermissions> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? null;
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role | "";
  const rolePerms = role ? PERMISSIONS[role] : null;
  const features = resolveFeatures(role, rolePerms?.features ?? [], user?.permissions ?? []);

  return {
    role,
    pages: rolePerms?.pages ?? [],
    features,
  };
}

export function hasFeature(perms: ServerPermissions, feature: Feature): boolean {
  return perms.features.includes(feature);
}
