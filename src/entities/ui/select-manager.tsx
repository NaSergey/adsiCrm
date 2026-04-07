"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { SelectSearch } from "@/shared/ui/select-search";
import { useManagers } from "@/entities/api/use-managers";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

interface SelectManagerProps extends Omit<SelectSearchProps, "options"> {
  label?: string;
}

export function SelectManager({ label, ...props }: SelectManagerProps) {
  const t = useTranslations("selects");
  const { data, isLoading } = useManagers();

  const options = (data ?? []).map((u) => ({
    value: String(u.id),
    label: u.name,
  }));

  return (
    <SelectSearch
      label={label}
      options={options}
      placeholder={isLoading ? t("loading") : t("manager")}
      disabled={isLoading}
      {...props}
    />
  );
}
