import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { CampaignView } from "./components/campaign-view";

export default async function CampaignPage() {
  const { features } = await getServerPermissions();
  const canManageCampaigns = features.includes("manage_campaigns");

  return (
    <div className="">
      <CampaignView canManageCampaigns={canManageCampaigns} />
    </div>
  );
}
