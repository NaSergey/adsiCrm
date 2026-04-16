/**
 * Role-based access control config.
 * pages  — hrefs the role can visit (matched against navItems)
 * features — granular UI capabilities
 */

export type Role = "ADMIN" | "MANAGER" | "PARTNER" | "INTEGRATOR" | "BRAND_MANAGER";

export type Feature =
  | "create_user"
  | "delete_user"
  | "edit_user"
  | "view_all_leads"
  | "view_basic_leads"
  | "create_lead"
  | "edit_lead"
  | "delete_lead"
  | "full_leads_filters"
  | "import_leads"
  | "export_leads"
  | "view_all_partners"
  | "view_own_partners"
  | "view_all_brokers"
  | "view_own_brokers"
  | "create_broker"
  | "view_affiliates"
  | "view_logs"
  | "view_users_page"
  | "view_wiki"
  | "manage_campaigns"
  | "manage_affiliates";

interface RolePermissions {
  pages: string[];
  features: Feature[];
}

/**
 * Features that are gated by JWT permissions.
 * If a role has these features, they are removed unless the user has the corresponding JWT permission.
 */
export const JWT_PERMISSION_GATES: Record<string, Feature[]> = {
  full_leads_display: ["full_leads_filters", "export_leads"],
  full_partners_display: ["view_all_partners"],
  full_brokers_display: ["view_all_brokers"],
  access_to_create_broker: ["create_broker"],
};

/** All features that require explicit JWT permission */
export const GATED_FEATURES = new Set<Feature>(
  Object.values(JWT_PERMISSION_GATES).flat()
);

export const PERMISSIONS: Record<Role, RolePermissions> = {
  ADMIN: {
    pages: ["/campaign", "/leads","/settings", "/affiliates", "/senderLead", "/logs", "/users", "/wiki"],
    features: [
      "create_user", "delete_user", "edit_user",
      "view_all_leads", "create_lead", "edit_lead", "delete_lead",
      "full_leads_filters", "import_leads", "export_leads",
      "view_all_partners", "view_all_brokers", "create_broker",
      "view_affiliates", "view_logs", "view_users_page", "view_wiki", "manage_campaigns", "manage_affiliates",
    ],
  },

  MANAGER: {
    pages: ["/campaign", "/leads", "/affiliates", "/wiki"],
    features: [
      "view_all_leads", "create_lead", "edit_lead",
      "full_leads_filters", "export_leads",
      "view_all_partners", "view_own_partners",
      "view_affiliates", "view_wiki",
    ],
  },

  BRAND_MANAGER: {
    pages: ["/leads", "/affiliates", "/senderLead", "/wiki"],
    features: [
      "view_all_leads", "view_basic_leads",
      "view_all_brokers", "view_own_brokers",
      "view_affiliates", "view_wiki",
    ],
  },

  PARTNER: {
    pages: ["/leads", "/wiki"],
    features: [
      "view_basic_leads", "create_lead",
      "view_own_partners",
      "view_wiki",
    ],
  },

  INTEGRATOR: {
    pages: ["/affiliates", "/senderLead", "/wiki"],
    features: ["create_lead", "view_own_brokers", "view_all_brokers", "view_affiliates", "view_wiki"],
  },
};
