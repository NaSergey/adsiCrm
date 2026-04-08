import { cookies } from "next/headers";
import { getTokenUser } from "./auth-token";
import { PERMISSIONS, type Role, type Feature } from "@/shared/config/permissions";

const ACCESS_TOKEN_KEY = "pixelcrm_access_token";

export interface ServerPermissions {
  role: Role | "";
  pages: string[];
  features: Feature[];
}

export async function getServerPermissions(): Promise<ServerPermissions> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? null;
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role | "";
  const perms = role ? PERMISSIONS[role] : null;

  return {
    role,
    pages: perms?.pages ?? [],
    features: perms?.features ?? [],
  };
}

export function hasFeature(perms: ServerPermissions, feature: Feature): boolean {
  return perms.features.includes(feature);
}
