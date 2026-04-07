"use client";

import { useTranslations } from "next-intl";
import { SelectSearch } from "@/shared/ui/select-search";
import { useLanguages } from "../api/use-languages";
import type { ComponentProps } from "react";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

export function SelectLang({ label, ...props }: Omit<SelectSearchProps, "options"> & { label?: string }) {
  const t = useTranslations("selects");
  const { data = [] } = useLanguages();
  const options = data.map((l) => ({ value: l, label: l }));
  return <SelectSearch label={label} options={options} placeholder={t("language")} {...props} />;
}
