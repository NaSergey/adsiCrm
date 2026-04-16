"use client";

import { useState } from "react";
import { SectionHeading } from "@/shared/ui/section-heading";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { StatusSettingTab } from "./components/status-setting-tab";
import { ApiKeysTab } from "./components/api-keys-tab";
import { AutologinTab } from "./components/autologin-tab";

type Tab = "system" | "status" | "api" | "autologin" ;

const tabs = [
  // { id: "system" as Tab, label: "System" },
  { id: "status" as Tab, label: "Status Setting" },
  // { id: "api" as Tab, label: "API Keys" },
  { id: "autologin" as Tab, label: "Autologin URL" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("status");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeading title="Settings" />
        <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div>
        {/* {activeTab === "system" && <SystemTab />} */}
        {activeTab === "status" && <StatusSettingTab />}
        {activeTab === "api" && <ApiKeysTab />}
        {activeTab === "autologin" && <AutologinTab />}
      </div>
    </div>
  );
}
