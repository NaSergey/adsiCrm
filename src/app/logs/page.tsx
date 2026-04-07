"use client";

import { useTranslations } from "next-intl";
import { LogsSection } from "./components/logs-section";
import { SectionHeading } from "@/shared/ui/section-heading";

export default function LogsPage() {
  const t = useTranslations("logs");
  return (
    <div className="p-6 px-10 space-y-4">
      <SectionHeading title={t("title")} />
      <LogsSection />
    </div>
  );
}
