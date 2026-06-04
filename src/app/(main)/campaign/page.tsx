import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { serverFetchClient } from "@/shared/api/server";
import { CampaignView } from "./components/campaign-view";
import { EMPTY_CAMPAIGN_FILTERS } from "./types";
import { campaignFilterBody, campaignQueryKey } from "./hooks/use-campaign-data";

interface Props {
  searchParams: Promise<{ editCampaign?: string }>;
}

// Префетч первой страницы кампаний с дефолтными фильтрами — те же ключи и тело,
// что использует useCampaignData на клиенте, поэтому клиент берёт данные из кэша
// без повторного запроса и лоадера. Программный фильтр по умолчанию "all" → нужны
// и активные, и неактивные.
async function prefetchCampaigns(queryClient: QueryClient) {
  const page = 1;
  const filters = EMPTY_CAMPAIGN_FILTERS;

  const fetchByActive = (isActive: boolean) => async () => {
    const { data, error } = await serverFetchClient.POST("/campaigns/find-by-filters", {
      params: { query: { page } },
      body: campaignFilterBody(isActive, filters),
    });
    if (error) throw error;
    return data;
  };

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: campaignQueryKey(page, filters, "active"),
      queryFn: fetchByActive(true),
    }),
    queryClient.prefetchQuery({
      queryKey: campaignQueryKey(page, filters, "inactive"),
      queryFn: fetchByActive(false),
    }),
  ]);
}

export default async function CampaignPage({ searchParams }: Props) {
  const { features } = await getServerPermissions();
  const canManageCampaigns = features.includes("manage_campaigns");
  const params = await searchParams;
  const openCampaignId = params.editCampaign ? Number(params.editCampaign) : undefined;

  const queryClient = new QueryClient();
  await prefetchCampaigns(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="">
        <CampaignView canManageCampaigns={canManageCampaigns} openCampaignId={openCampaignId} />
      </div>
    </HydrationBoundary>
  );
}
