"use client";

import { useState } from "react";
import { AffiliatesToolbar } from "./affiliates-toolbar";
import { PartnersSection } from "./partners/partners-section";
import { BrokersSection } from "./broker/brokers-section";
import { AffiliatesSelectionProvider } from "../selection-context";
import type { AffiliateTab } from "../types";
import type { Feature } from "@/shared/config/permissions";

interface AffiliatesViewProps {
  permissions: {
    pages: string[];
    features: Feature[];
  };
  openPartnerId?: number;
  openBrokerId?: number;
}

export function AffiliatesView({ permissions, openPartnerId, openBrokerId }: AffiliatesViewProps) {
  const canViewPartners = permissions.features.includes("view_all_partners") || permissions.features.includes("view_own_partners");

  const defaultTab: AffiliateTab = openBrokerId
    ? "brokers"
    : canViewPartners ? "partners" : "brokers";

  const [activeTab, setActiveTab] = useState<AffiliateTab>(defaultTab);

  return (
    <AffiliatesSelectionProvider activeTab={activeTab}>
      <AffiliatesToolbar activeTab={activeTab} onTabChange={setActiveTab} features={permissions.features} />
      {activeTab === "partners"
        ? <PartnersSection openPartnerId={openPartnerId} />
        : <BrokersSection openBrokerId={openBrokerId} />}
    </AffiliatesSelectionProvider>
  );
}
