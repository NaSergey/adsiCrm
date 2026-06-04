import { useState, forwardRef, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { SelectFtd } from "@/entities";
import { type Lead } from "@/shared/types/lead";
import { stats } from "@/shared/data/stats";
import { FtdConfirmBlock } from "./ftd-confirm-block";

interface LeadInfoTabProps {
  lead: Lead;
}

export interface LeadInfoTabRef {
  getValues: () => { status: string; ftd: boolean; isChangeableStatus: boolean; ftdPending: boolean };
  isDirty: () => boolean;
}

export const LeadInfoTab = forwardRef<LeadInfoTabRef, LeadInfoTabProps>(({ lead }, ref) => {
  const t = useTranslations("leadDetail");
  const fullLead = lead as unknown as {
    ftd?: boolean;
    ftdDate?: string;
    ftdPending?: boolean;
    isChangeableStatus?: boolean;
    ip?: string;
    brokerLeadId?: string;
    brokerUpdateDate?: string;
  };

  const [ftd, setFtd] = useState(fullLead.ftd ?? false);
  const [status, setStatus] = useState(lead.status);
  const [isChangeableStatus, setIsChangeableStatus] = useState(fullLead.isChangeableStatus ?? true);

  useImperativeHandle(ref, () => ({
    isDirty: () => status !== lead.status || ftd !== (fullLead.ftd ?? false) || isChangeableStatus !== (fullLead.isChangeableStatus ?? true),
    getValues: () => ({
      ftd,
      status,
      isChangeableStatus,
      ftdPending: fullLead.ftdPending ?? false,
    }),
  }));

  const statusOptions = stats
    .filter((s) => s.value !== null)
    .map((s) => ({ value: s.value as string, label: s.label }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
      {/* <FtdConfirmBlock
        leadId={lead.id}
        ftd={fullLead.ftd ?? false}
        ftdPending={fullLead.ftdPending ?? false}
        ftdDate={fullLead.ftdDate}
      /> */}
      <Input label={t("firstName")} value={lead.firstName} readOnly />
      <Input label={t("lastName")} value={lead.lastName} readOnly />
      {/* <div className="sm:col-span-2">
        <Input label={t("email")} value={lead.email} readOnly />
      </div> */}
      <Input label={t("ftdDate")} value={fullLead.ftdDate ?? ""} readOnly />
      <SelectFtd
        label={t("ftd")}
        value={ftd ? "true" : "false"}
        onChange={(v) => setFtd(v === "true")}
      />
      <Input label={t("phone")} value={lead.phone} readOnly />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">{t("status")}</span>
          <Checkbox
            label={t("dontUpdateStatus")}
            checked={!isChangeableStatus}
            onChange={(e) => setIsChangeableStatus(!e.target.checked)}
          />
        </div>
        <Select
          value={status}
          options={statusOptions}
          onChange={setStatus}
        />
      </div>
      <Input label={t("userIp")} value={fullLead.ip ?? ""} readOnly />
      <Input label={t("funnel")} value={lead.funnel ?? ""} readOnly />
      <Input label={t("country")} value={lead.country ?? ""} readOnly />
      <Input label={t("language")} value={lead.language ?? ""} readOnly />
      <Input label={t("brokerLeadId")} value={fullLead.brokerLeadId ?? ""} readOnly />
      <Input label={t("brokerUpdateDate")} value={fullLead.brokerUpdateDate ?? ""} readOnly />
    </div>
  );
});

LeadInfoTab.displayName = "LeadInfoTab";
