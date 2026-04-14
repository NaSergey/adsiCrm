import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/css";
import { CheckCircle } from "lucide-react";
import { Textarea } from "@/shared/ui/textarea";
import { type Lead } from "@/shared/types/lead";

interface ErrorStatusTabProps {
  lead: Lead;
}

type CheckType = "error" | "success";

function CheckRow({ label, message, type }: { label: string; message: string; type: CheckType }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <div className={cn(
        "px-3 py-2 rounded-md text-sm",
        type === "error" && "bg-red-500/10 text-red-400",
        type === "success" && "bg-green-500/10 text-green-400",
      )}>
        {message}
      </div>
    </div>
  );
}

export function ErrorStatusTab({ lead }: ErrorStatusTabProps) {
  const t = useTranslations("leadDetail");
  const fraudInfo = lead.isFraudInfo ?? {};
  const partnerError = (lead.partnerResponse as { error?: string } | null)?.error;

  const brokerAnswer = lead.brokerResponse
    ? JSON.stringify(lead.brokerResponse, null, 2)
    : "";
  const partnerAnswer = lead.partnerResponse && Object.keys(lead.partnerResponse).length > 0
    ? JSON.stringify(lead.partnerResponse, null, 2)
    : "";

  // Build only the fraud checks that actually have data
  const fraudChecks: { label: string; message: string }[] = [
    ...(fraudInfo.ip
      ? [{ label: t("fraudIpLabel"), message: fraudInfo.ip }]
      : []),
    ...(fraudInfo.autologinIp || fraudInfo.autologinUseragent
      ? [{ label: t("fraudAutologinLabel"), message: (fraudInfo.autologinIp ?? fraudInfo.autologinUseragent)! }]
      : []),
    ...(fraudInfo.useragent
      ? [{ label: t("fraudUseragentLabel"), message: fraudInfo.useragent }]
      : []),
    ...(fraudInfo.autologinFingerprintConfidence || fraudInfo.autologinFingerprintCountry || fraudInfo.autologinFingerprintLanguage || fraudInfo.autologinFingerprintScreenFrame
      ? [{ label: t("fraudFingerprintLabel"), message: (fraudInfo.autologinFingerprintConfidence ?? fraudInfo.autologinFingerprintCountry ?? fraudInfo.autologinFingerprintLanguage ?? fraudInfo.autologinFingerprintScreenFrame)! }]
      : []),
  ];

  const hasErrors = lead.dublicate || !!partnerError;

  return (
    <div className="grid grid-cols-3 flex-1 gap-0">
      {/* Col 1 — Fraud Checks */}
      <div className="flex flex-col gap-2 pr-6 border-r border-gray-1000">
        <span className="text-base text-foreground">{t("fraudAndErrors")}</span>

        {!lead.isFraud ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-500/10 text-green-400 text-sm">
            <CheckCircle className="size-4 shrink-0" />
            {t("reliableLead")}
          </div>
        ) : (
          fraudChecks.map((check) => (
            <CheckRow key={check.label} label={check.label} message={check.message} type="error" />
          ))
        )}

        {hasErrors && (
          <CheckRow
            label={t("errorsLabel")}
            message={lead.dublicate ? t("duplicateDetected") : partnerError!}
            type="error"
          />
        )}
      </div>

      {/* Col 2 — Lead Rout + Status History */}
      <div className="flex flex-col gap-4 px-6 border-r border-gray-1000">
        <div className="flex flex-col gap-2">
          <span className="text-base text-foreground">{t("leadRout")}</span>
          <div className="flex flex-col divide-y divide-gray-1000">
            {[
              { label: t("campaign"), value: lead.campaign?.name ?? lead.funnel ?? "—" },
              { label: t("partner"), value: lead.partner?.name ?? "—" },
              { label: t("broker"), value: lead.broker?.name ?? "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm text-blue-400">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-foreground">{t("statusHistory")}</span>
          <div className="flex flex-col gap-0.5">
            {(lead.leadStatusHistory ?? []).map((entry) => (
              <span key={entry.id} className="px-1 py-1 text-sm text-green-400">
                {new Date(entry.createdAt).toLocaleDateString()} : status &quot;{entry.status}&quot;
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Col 3 — Broker/Partner Answer */}
      <div className="flex flex-col gap-4 pl-6">
        <span className="text-base text-foreground">{t("brokerPartnerAnswer")}</span>
        {brokerAnswer && <Textarea label={t("brokerAnswer")} rows={7} readOnly value={brokerAnswer} />}
        {partnerAnswer && <Textarea label={t("partnerAnswer")} rows={7} readOnly value={partnerAnswer} />}
        {!brokerAnswer && !partnerAnswer && (
          <span className="text-sm text-gray-500">{t("noResponses")}</span>
        )}
      </div>
    </div>
  );
}
