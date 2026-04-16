"use client";

import { useTranslations } from "next-intl";
import { LogsSection } from "./components/logs-section";
import { SectionHeading } from "@/shared/ui/section-heading";

export default function LogsPage() {
  const t = useTranslations("logs");
  return (
    <div className=" space-y-4">
      <SectionHeading title={t("title")} />
      <LogsSection />
    </div>
  );
}
