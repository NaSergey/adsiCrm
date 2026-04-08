import { getServerPermissions, hasFeature } from "@/shared/lib/get-server-permissions";
import { LeadsPageClient } from "./leads-page-client";

export default async function LeadsPage() {
  const perms = await getServerPermissions();

  return (
    <LeadsPageClient
      canDeleteLeads={hasFeature(perms, "delete_lead")}
      canImport={hasFeature(perms, "import_leads")}
      canExport={hasFeature(perms, "export_leads")}
    />
  );
}
