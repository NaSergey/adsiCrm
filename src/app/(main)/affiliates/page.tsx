import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { AffiliatesView } from "./components/affiliates-view";

export default async function AffiliatesPage() {
  const permissions = await getServerPermissions();

  return (
    <div className="p-6 px-10">
      <AffiliatesView permissions={permissions} />
    </div>
  );
}
