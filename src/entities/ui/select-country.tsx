"use client";

import { useTranslations } from "next-intl";
import { SelectSearch } from "@/shared/ui/select-search";
import { useCountries } from "../api/data/use-countries";
import type { ComponentProps } from "react";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

export function SelectCountry({ label, ...props }: Omit<SelectSearchProps, "options"> & { label?: string }) {
  const t = useTranslations("selects");
  const { data = [] } = useCountries();
  const options = data.map((c) => ({ value: c, label: c }));
  return <SelectSearch label={label} options={options} placeholder={t("country")} {...props} />;
}
