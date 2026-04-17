import { getServerPermissions } from "@/shared/lib/get-server-permissions";
import { AffiliatesView } from "./components/affiliates-view";

interface Props {
  searchParams: Promise<{ editPartner?: string; editBroker?: string }>;
}

export default async function AffiliatesPage({ searchParams }: Props) {
  const permissions = await getServerPermissions();
  const params = await searchParams;
  const openPartnerId = params.editPartner ? Number(params.editPartner) : undefined;
  const openBrokerId = params.editBroker ? Number(params.editBroker) : undefined;

  return (
    <div className="">
      <AffiliatesView permissions={permissions} openPartnerId={openPartnerId} openBrokerId={openBrokerId} />
    </div>
  );
}
