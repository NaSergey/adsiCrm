"use client";

import { useEffect, useMemo } from "react";
import { useState } from "react";
import { Plus, MousePointerClick, X, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { CreateBrokerModal, CreatePartnerModal } from "@/features/dialog";
import { useAffiliatesSelection } from "../selection-context";
import type { AffiliateTab } from "../types";
import type { Feature } from "@/shared/config/permissions";

interface AffiliatesToolbarProps {
  activeTab: AffiliateTab;
  onTabChange: (tab: AffiliateTab) => void;
  features: Feature[];
}

export function AffiliatesToolbar({ activeTab, onTabChange, features }: AffiliatesToolbarProps) {
  const t = useTranslations("affiliates");
  const [createPartnerOpen, setCreatePartnerOpen] = useState(false);
  const [createBrokerOpen, setCreateBrokerOpen] = useState(false);
  const { isSelecting, selectedIds, isDeleting, startSelect, exitSelect, deleteSelected } = useAffiliatesSelection();

  const canViewPartners = features.includes("view_all_partners") || features.includes("view_own_partners");
  const canViewBrokers = features.includes("view_all_brokers") || features.includes("view_own_brokers");
  const canCreate = features.includes("create_broker");

  const tabs = useMemo(() => [
    canViewPartners && { id: "partners" as AffiliateTab, label: t("partners") },
    canViewBrokers && { id: "brokers" as AffiliateTab, label: t("brokers") },
  ].filter(Boolean) as { id: AffiliateTab; label: string }[], [canViewPartners, canViewBrokers, t]);

  // If current tab is not available, switch to first available tab
  useEffect(() => {
    const isCurrentTabAvailable = tabs.some(tab => tab.id === activeTab);
    if (!isCurrentTabAvailable && tabs.length > 0) {
      onTabChange(tabs[0].id);
    }
  }, [tabs, activeTab, onTabChange]);

  return (
    <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      {canCreate && (
        <div className="flex items-center gap-2 ml-auto">
          {isSelecting && selectedIds.size > 0 && (
            <Button
              size="md"
              variant="destructive"
              disabled={isDeleting}
              onClick={deleteSelected}
            >
              <Trash2 className="size-4" />
              {isDeleting ? t("deleting") : `${t("deleteSelected")} (${selectedIds.size})`}
            </Button>
          )}

          <Button
            size="md"
            variant={isSelecting ? "ghostActive" : "secondary"}
            className="shrink-0"
            onClick={isSelecting ? exitSelect : startSelect}
          >
            {isSelecting ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
            {isSelecting ? t("cancelSelect") : t("select")}
          </Button>

          <Button
            size="md"
            className="shrink-0"
            onClick={() => activeTab === "partners" ? setCreatePartnerOpen(true) : setCreateBrokerOpen(true)}
          >
            <Plus className="size-4" />
            {activeTab === "partners" ? t("newPartner") : t("newBroker")}
          </Button>
        </div>
      )}

      <CreatePartnerModal open={createPartnerOpen} onOpenChange={setCreatePartnerOpen} />
      <CreateBrokerModal open={createBrokerOpen} onOpenChange={setCreateBrokerOpen} />
    </section>
  );
}
