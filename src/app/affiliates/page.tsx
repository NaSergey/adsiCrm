import { cookies } from "next/headers";
import { getTokenUser } from "@/shared/lib/auth-token";
import { PERMISSIONS } from "@/shared/config/permissions";
import { AffiliatesView } from "./components/affiliates-view";
import type { Role } from "@/shared/config/permissions";

const ACCESS_TOKEN_KEY = "pixelcrm_access_token";

export default async function AffiliatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value ?? null;
  const user = token ? getTokenUser(token) : null;
  const role = (user?.role ?? "") as Role;
  const permissions = PERMISSIONS[role] ?? { pages: [], features: [] };

  return (
    <div className="p-6 px-10">
      <AffiliatesView permissions={permissions} />
    </div>
  );
}
