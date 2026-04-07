"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { SelectSearch } from "@/shared/ui/select-search";
import { useBrandManagers } from "@/entities/api/use-brand-managers";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

interface SelectBrandManagerProps extends Omit<SelectSearchProps, "options"> {
  label?: string;
}

export function SelectBrandManager({ label, ...props }: SelectBrandManagerProps) {
  const t = useTranslations("selects");
  const { data, isLoading } = useBrandManagers();

  const options = (data ?? []).map((u) => ({
    value: String(u.id),
    label: u.name,
  }));

  return (
    <SelectSearch
      label={label}
      options={options}
      placeholder={isLoading ? t("loading") : t("brandManager")}
      disabled={isLoading}
      {...props}
    />
  );
}
