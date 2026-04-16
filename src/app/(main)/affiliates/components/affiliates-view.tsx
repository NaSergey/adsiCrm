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
}

export function AffiliatesView({ permissions }: AffiliatesViewProps) {
  const canViewPartners = permissions.features.includes("view_all_partners") || permissions.features.includes("view_own_partners");
  const [activeTab, setActiveTab] = useState<AffiliateTab>(canViewPartners ? "partners" : "brokers");

  return (
    <AffiliatesSelectionProvider activeTab={activeTab}>
      <AffiliatesToolbar activeTab={activeTab} onTabChange={setActiveTab} features={permissions.features} />
      {activeTab === "partners" ? <PartnersSection /> : <BrokersSection />}
    </AffiliatesSelectionProvider>
  );
}
