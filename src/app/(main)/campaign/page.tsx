import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { CampaignView } from "./components/campaign-view";

interface Props {
  searchParams: Promise<{ editCampaign?: string }>;
}

export default async function CampaignPage({ searchParams }: Props) {
  const { features } = await getServerPermissions();
  const canManageCampaigns = features.includes("manage_campaigns");
  const params = await searchParams;
  const openCampaignId = params.editCampaign ? Number(params.editCampaign) : undefined;

  return (
    <div className="">
      <CampaignView canManageCampaigns={canManageCampaigns} openCampaignId={openCampaignId} />
    </div>
  );
}
