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
  | "view_wiki";

interface RolePermissions {
  pages: string[];
  features: Feature[];
}

export const PERMISSIONS: Record<Role, RolePermissions> = {
  ADMIN: {
    pages: ["/campaign", "/leads","/settings", "/affiliates", "/senderLead", "/logs", "/users", "/wiki"],
    features: [
      "create_user", "delete_user", "edit_user",
      "view_all_leads", "create_lead", "edit_lead", "delete_lead",
      "full_leads_filters", "import_leads", "export_leads",
      "view_all_partners", "view_all_brokers", "create_broker",
      "view_affiliates", "view_logs", "view_users_page", "view_wiki",
    ],
  },

  MANAGER: {
    pages: ["/campaign", "/leads", "/affiliates", "/wiki"],
    features: [
      "view_all_leads", "create_lead", "edit_lead", "delete_lead",
      "full_leads_filters", "import_leads", "export_leads",
      "view_all_partners", "view_own_partners",
      "view_affiliates", "view_wiki",
    ],
  },

  BRAND_MANAGER: {
    pages: ["/campaign", "/leads", "/affiliates", "/wiki"],
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
    features: ["create_lead", "view_all_brokers", "view_affiliates", "view_wiki"],
  },
};
