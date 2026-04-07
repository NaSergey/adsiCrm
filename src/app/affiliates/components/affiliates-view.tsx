"use client";

import { useState } from "react";
import { AffiliatesToolbar } from "./affiliates-toolbar";
import { PartnersSection } from "./partners/partners-section";
import { BrokersSection } from "./broker/brokers-section";
import type { AffiliateTab } from "../types";

export function AffiliatesView() {
  const [activeTab, setActiveTab] = useState<AffiliateTab>("partners");

  return (
    <>
      <AffiliatesToolbar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "partners" ? <PartnersSection /> : <BrokersSection />}
    </>
  );
}
