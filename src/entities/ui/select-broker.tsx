"use client";

import { useTranslations } from "next-intl";
import { useBrokers } from "../api/use-brokers";
import type { ComponentProps } from "react";
import { SelectSearch } from "@/shared/ui/select-search";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

interface SelectBrokerProps extends Omit<SelectSearchProps, "options"> {
  label?: string;
}

export function SelectBroker({ label, ...props }: SelectBrokerProps) {
  const t = useTranslations("selects");
  const { data } = useBrokers();

  const options = (data ?? []).map((broker) => ({
    value: String(broker.id),
    label: broker.name,
  }));

  return (
    <SelectSearch
      label={label}
      options={options}
      placeholder={t("broker")}
      {...props}
    />
  );
}
