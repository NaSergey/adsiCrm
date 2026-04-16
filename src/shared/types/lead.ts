import type { components } from "@/shared/api/schema";


export type Lead = components["schemas"]["FilteredResponseLeadDto"]["items"][number];

export type FilterType = "input" | "select" | "date";

export interface FilterConfig {
  id: string;
  label: string;
  type: FilterType;
  options?: { value: string; label: string }[];
}

export interface LeadsFiltersState {
  lead_id: string;
  broker_lead_id: string;
  user_ip: string;
  campaign: string;
  ftd: string;
  partner: string;
  broker: string;
  funnel: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  date_from: string;
  date_to: string;
  language: string;
}

export const EMPTY_LEADS_FILTERS: LeadsFiltersState = {
  lead_id: "", broker_lead_id: "", user_ip: "", campaign: "",
  ftd: "", partner: "", broker: "", funnel: "", email: "",
  phone: "", country: "", status: "", date_from: "", date_to: "", language: "",
};

export function filtersToApiBody(filters: LeadsFiltersState) {
  return {
    ftd: filters.ftd ? filters.ftd === "true" : false,
    ftdPending: false,
    id:           filters.lead_id        ? Number(filters.lead_id)  : undefined,
    brokerLeadId: filters.broker_lead_id || undefined,
    ip:           filters.user_ip        || undefined,
    campaignId:   filters.campaign       ? Number(filters.campaign) : undefined,
    partnerId:    filters.partner        ? Number(filters.partner)  : undefined,
    brokerId:     filters.broker         ? Number(filters.broker)   : undefined,
    funnel:       filters.funnel         || undefined,
    email:        filters.email          || undefined,
    phone:        filters.phone          || undefined,
    country:      filters.country        || undefined,
    status:       filters.status         || undefined,
    fromDate:     filters.date_from      || undefined,
    toDate:       filters.date_to        || undefined,
    language:     filters.language       || undefined,
  };
}
