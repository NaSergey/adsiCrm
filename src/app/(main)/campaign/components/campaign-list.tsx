"use client";

import { useState, useMemo } from "react";
import { EditBrokerModal, EditPartnerModal, CampaignModal, type BrokerData, type PartnerData, type CampaignData } from "@/features/dialog";
import { CampaignCard } from "./campaign-card";
import { usePinnedCampaigns } from "../hooks/use-pinned-campaigns";
import type { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  isSelecting?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number) => void;
  openCampaignId?: number;
  createdCampaign?: CampaignData | null;
  onCreatedCampaignClose?: () => void;
}

export function buildCampaignData(c: Campaign): CampaignData {
  return {
    id: String(c.id),
    name: c.name,
    cap: String(c.dailyCap),
    comment: c.comment,
    countries: c.countries,
    languages: c.languages,
    partnerId: String(c.partner?.id ?? ""),
    brokerId: String(c.broker?.id ?? ""),
    managerId: String(c.manager?.id ?? ""),
    status: c.isActive ? "ON" : "OFF",
    checkerFunnel: c.checkFunnel,
    funnelData: c.funnel,
    isScheduleEnabled: c.isScheduleEnabled,
    timezone: c.timezone,
    workingHours: c.workingHours as Record<string, { start: string; end: string }>,
  };
}

export function CampaignList({
  campaigns,
  isSelecting = false,
  selectedIds = new Set(),
  onToggleSelect,
  openCampaignId,
  createdCampaign,
  onCreatedCampaignClose,
}: CampaignListProps) {
  const { pinned, toggle: togglePin } = usePinnedCampaigns();
  const [brokerModal, setBrokerModal] = useState<BrokerData | null>(null);
  const [partnerModal, setPartnerModal] = useState<PartnerData | null>(null);
  const [campaignModal, setCampaignModal] = useState<CampaignData | null>(null);
  const [autoDismissed, setAutoDismissed] = useState(false);

  const autoCampaign = useMemo<CampaignData | null>(() => {
    if (autoDismissed || !openCampaignId || !campaigns.length) return null;
    const c = campaigns.find((x) => x.id === openCampaignId);
    return c ? buildCampaignData(c) : null;
  }, [autoDismissed, openCampaignId, campaigns]);

  const effectiveCampaign = campaignModal ?? autoCampaign;

  const sorted = [...campaigns].sort((a, b) => (pinned.has(a.id) ? 0 : 1) - (pinned.has(b.id) ? 0 : 1));

  return (
    <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {sorted.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          isPinned={pinned.has(campaign.id)}
          isSelecting={isSelecting}
          isSelected={selectedIds.has(campaign.id)}
          onBookmark={(id) => togglePin(id)}
          onSelect={(id) => onToggleSelect?.(id)}
          onEdit={(c) => { setAutoDismissed(true); setCampaignModal(buildCampaignData(c)); }}
          onBrokerClick={(c) => setBrokerModal({ id: String(c.broker?.id ?? ""), name: c.broker?.name ?? "", comment: "", managerId: "" })}
          onPartnerClick={(c) => setPartnerModal({ id: c.partner?.id ?? 0, name: c.partner?.name ?? "", email: "", comment: "", partnerToken: "", role: "PARTNER", managerId: "" })}
        />
      ))}

      {brokerModal && (
        <EditBrokerModal
          open
          onOpenChange={(open) => { if (!open) setBrokerModal(null); }}
          broker={brokerModal}
          onDelete={() => setBrokerModal(null)}
        />
      )}

      {partnerModal && (
        <EditPartnerModal
          open
          onOpenChange={(open) => { if (!open) setPartnerModal(null); }}
          partner={partnerModal}
        />
      )}

      {effectiveCampaign && (
        <CampaignModal
          key={effectiveCampaign.id}
          open
          onOpenChange={(open) => { if (!open) { setAutoDismissed(true); setCampaignModal(null); } }}
          campaign={effectiveCampaign}
          onSave={() => { setAutoDismissed(true); setCampaignModal(null); }}
          onDelete={() => { setAutoDismissed(true); setCampaignModal(null); }}
          onCreateSuccess={(created) => { setAutoDismissed(true); setCampaignModal(created); }}
        />
      )}

      {createdCampaign && (
        <CampaignModal
          key={`created-${createdCampaign.id}`}
          open
          onOpenChange={(open) => { if (!open) onCreatedCampaignClose?.(); }}
          campaign={createdCampaign}
          onSave={onCreatedCampaignClose}
          onDelete={onCreatedCampaignClose}
        />
      )}
    </section>
  );
}
