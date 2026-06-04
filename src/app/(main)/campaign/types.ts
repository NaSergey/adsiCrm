import type { components } from "@/shared/api/schema";

export type Campaign = components["schemas"]["FilteredResponseCampaignDto"]["items"][number];
export type ProgramFilter = "all" | "active";

export interface CampaignFiltersState {
  partnerId: string;
  brokerId: string;
  country: string;
  lang: string;
  name: string;
}

// Живёт в обычном (не "use client") модуле, чтобы серверные компоненты
// импортировали реальный объект, а не client-reference прокси — иначе ключ
// react-query на сервере не совпадёт с клиентским (см. SSR-префетч кампаний).
export const EMPTY_CAMPAIGN_FILTERS: CampaignFiltersState = {
  partnerId: "",
  brokerId: "",
  country: "",
  lang: "",
  name: "",
};
