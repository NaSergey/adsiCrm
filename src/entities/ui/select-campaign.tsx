"use client";

import { useTranslations } from "next-intl";
import { useCampaigns } from "../api/use-campaigns";
import type { ComponentProps } from "react";
import { SelectSearch } from "@/shared/ui/select-search";

type SelectSearchProps = ComponentProps<typeof SelectSearch>;

interface SelectCampaignProps extends Omit<SelectSearchProps, "options"> {
  label?: string;
}

export function SelectCampaign({ label, ...props }: SelectCampaignProps) {
  const t = useTranslations("selects");
  const { data = [] } = useCampaigns();

  const options = data.map((campaign) => ({
    value: String(campaign.id),
    label: campaign.name,
  }));

  return (
    <SelectSearch
      label={label}
      options={options}
      placeholder={t("campaign")}
      {...props}
    />
  );
}
