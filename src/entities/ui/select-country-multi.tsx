"use client";

import { useTranslations } from "next-intl";
import { MultiSelect } from "@/shared/ui/multi-select";
import { useCountries } from "../api/use-countries";

interface SelectCountryMultiProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function SelectCountryMulti({ label, value, onChange }: SelectCountryMultiProps) {
  const t = useTranslations("selects");
  const { data = [] } = useCountries();
  const options = data.map((c) => ({ value: c, label: c }));
  return <MultiSelect label={label} options={options} placeholder={t("country")} value={value} onChange={onChange} />;
}
