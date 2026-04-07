"use client";

import { useTranslations } from "next-intl";
import { Select } from "../../shared/ui/select";
import { stats } from "@/shared/data/stats";
import type { ComponentProps } from "react";

type SelectProps = ComponentProps<typeof Select>;

const options = stats.filter((s) => s.value !== null) as { value: string; label: string }[];

export function SelectStats({ label, ...props }: Omit<SelectProps, "options"> & { label?: string }) {
  const t = useTranslations("selects");
  return <Select label={label} options={options} placeholder={t("status")} {...props} />;
}
