import type { FilterConfig } from "../../../../../shared/types/lead";

export const INITIAL_FILTERS: FilterConfig[] = [
  { id: "lead_id",        label: "Lead_id",        type: "input" },
  { id: "broker_lead_id", label: "Broker_lead_id", type: "input" },
  { id: "user_ip",        label: "User_ip",        type: "input" },
  { id: "campaign",       label: "Campaign",       type: "select" },
  { id: "ftd",            label: "Ftd",            type: "input" },
  { id: "partner",        label: "Partner",        type: "select" },
  { id: "broker",         label: "Broker",         type: "select" },
  { id: "funnel",         label: "Funnel",         type: "input" },
  { id: "email",          label: "Email",          type: "input" },
  { id: "phone",          label: "Phone",          type: "input" },
  { id: "country",        label: "Country",        type: "select" },
  { id: "status",         label: "Status",         type: "select" },
  { id: "date_from",      label: "Date from",      type: "date" },
  { id: "date_to",        label: "Date to",        type: "date" },
  { id: "language",       label: "Language",       type: "select" },
];

export const ALL_IDS = INITIAL_FILTERS.map((f) => f.id);
export const DEFAULT_VISIBLE = INITIAL_FILTERS.slice(0, 9).map((f) => f.id);

// Limited filters for users without full_leads_filters
export const LIMITED_FILTERS = ["status", "email", "funnel", "date_from", "date_to", "ftd", "country", "language"];

export const LS_KEY_VISIBLE = "leads_visible_filters";
export const LS_KEY_ORDER   = "leads_filter_order";
