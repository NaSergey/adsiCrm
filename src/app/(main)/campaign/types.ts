import type { components } from "@/shared/api/schema";

export type Campaign = components["schemas"]["FilteredResponseCampaignDto"]["items"][number];
export type ProgramFilter = "all" | "active";
