"use client";

import { useTranslations } from "next-intl";
import { MultiSelect } from "@/shared/ui/multi-select";
import { useLanguages } from "../api/data/use-languages";

interface SelectLangMultiProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
}

export function SelectLangMulti({ label, value, onChange }: SelectLangMultiProps) {
  const t = useTranslations("selects");
  const { data = [] } = useLanguages();
  const options = data.map((l) => ({ value: l, label: l }));
  return <MultiSelect label={label} options={options} placeholder={t("language")} value={value} onChange={onChange} />;
}
