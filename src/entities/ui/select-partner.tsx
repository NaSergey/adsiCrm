"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { SelectSearch } from "@/shared/ui/select-search";
import { usePartners } from "@/entities/api/use-partners";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

interface SelectPartnerProps extends Omit<SelectSearchProps, "options"> {
  label?: string;
}

export function SelectPartner({ label, ...props }: SelectPartnerProps) {
  const t = useTranslations("selects");
  const { data } = usePartners();

  const options = (data ?? []).map((u) => ({
    value: String(u.id),
    label: u.name,
  }));

  return (
    <SelectSearch
      label={label}
      options={options}
      placeholder={t("partner")}
      {...props}
    />
  );
}
