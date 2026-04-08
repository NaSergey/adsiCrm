export type AffiliateTab = "partners" | "brokers";

export interface Partner {
  id: string;
  name: string;
  email: string;
  comment: string;
  partner_token: string;
  manager: string;
}

export interface Broker {
  id: string;
  name: string;
  comment: string;
}
