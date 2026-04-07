"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { CreateBrokerModal, CreatePartnerModal } from "@/features/dialog";
import type { AffiliateTab } from "../types";


interface AffiliatesToolbarProps {
  activeTab: AffiliateTab;
  onTabChange: (tab: AffiliateTab) => void;
}

export function AffiliatesToolbar({ activeTab, onTabChange }: AffiliatesToolbarProps) {
  const t = useTranslations("affiliates");
  const [createPartnerOpen, setCreatePartnerOpen] = useState(false);
  const [createBrokerOpen, setCreateBrokerOpen] = useState(false);

  const tabs = [
    { id: "partners" as AffiliateTab, label: t("partners") },
    { id: "brokers" as AffiliateTab, label: t("brokers") },
  ];

  return (
    <section className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />

      <Button
        size="md"
        className="shrink-0"
        onClick={() => activeTab === "partners" ? setCreatePartnerOpen(true) : setCreateBrokerOpen(true)}
      >
        <Plus className="size-4" />
        {activeTab === "partners" ? t("newPartner") : t("newBroker")}
      </Button>

      <CreatePartnerModal
        open={createPartnerOpen}
        onOpenChange={setCreatePartnerOpen}
      />

      <CreateBrokerModal
        open={createBrokerOpen}
        onOpenChange={setCreateBrokerOpen}
      />
    </section>
  );
}
