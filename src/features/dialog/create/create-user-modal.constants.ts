export const usersQueryKey = ["users"] as const;

export const PARTNERS_DISPLAY_OPTIONS = [
  { value: "all", labelKey: "partnersDisplayAll" },
  { value: "own", labelKey: "partnersDisplayOwn" },
] as const;

export const LEADS_DISPLAY_OPTIONS = [
  { value: "full", labelKey: "leadsDisplayFull" },
  { value: "basic", labelKey: "leadsDisplayBasic" },
] as const;

export const BROKERS_DISPLAY_OPTIONS = [
  { value: "all", labelKey: "brokersDisplayAll" },
  { value: "own", labelKey: "brokersDisplayOwn" },
] as const;

export const ACCESS_BROKER_OPTIONS = [
  { value: "true", labelKey: "yes" },
  { value: "false", labelKey: "no" },
] as const;
