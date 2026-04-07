"use client";

import { useTranslations } from "next-intl";
import { Select } from "../../shared/ui/select";
import type { ComponentProps } from "react";

type SelectProps = ComponentProps<typeof Select>;

export function SelectFtd({ label, ...props }: Omit<SelectProps, "options"> & { label?: string }) {
  const t = useTranslations("selects");
  const options = [
    { value: "true", label: t("yes") },
    { value: "false", label: t("no") },
  ];
  return <Select label={label} options={options} placeholder={t("ftd")} {...props} />;
}
