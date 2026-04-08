import { useTranslations } from "next-intl";
import { useRoles } from "@/entities/api/data/use-roles";
import {
  PARTNERS_DISPLAY_OPTIONS,
  LEADS_DISPLAY_OPTIONS,
  BROKERS_DISPLAY_OPTIONS,
  ACCESS_BROKER_OPTIONS,
} from "./create-user-modal.constants";

const translate = (
  options: readonly { value: string; labelKey: string }[],
  t: (key: string) => string
) => options.map((o) => ({ value: o.value, label: t(o.labelKey) }));

export function useCreateUserOptions() {
  const t = useTranslations("createModals");
  const { data: roles = [] } = useRoles();

  const toTranslationKey = (role: string) =>
    role.toLowerCase().replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

  const roleOptions = roles.map((role) => ({
    value: role,
    label: t(`roles.${toTranslationKey(role)}`),
  }));

  return {
    roleOptions,
    partnersDisplayOptions: translate(PARTNERS_DISPLAY_OPTIONS, t),
    leadsDisplayOptions: translate(LEADS_DISPLAY_OPTIONS, t),
    brokersDisplayOptions: translate(BROKERS_DISPLAY_OPTIONS, t),
    accessBrokerOptions: translate(ACCESS_BROKER_OPTIONS, t),
  };
}
