"use client";

import { useTranslations } from "next-intl";
import { useToast } from "@/shared/ui/toast";

export type ToastEntity = "broker" | "partner" | "user" | "campaign" | "lead";

export function useAppToast() {
  const t = useTranslations("toast");
  const { show } = useToast();

  return {
    created: (entity: ToastEntity) => show("created", t(entity), t("created")),
    updated: (entity: ToastEntity) => show("updated", t(entity), t("updated")),
    deleted: (entity: ToastEntity) => show("deleted", t(entity), t("deleted")),
    error:   (desc?: string)        => show("error",   t("error"),  desc),
  };
}
