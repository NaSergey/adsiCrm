import { cn } from "@/shared/lib/css";
import { Textarea } from "@/shared/ui/textarea";
import { type Lead } from "../../../../app/leads/types";

interface ErrorStatusTabProps {
  lead: Lead;
}

export function ErrorStatusTab({ lead }: ErrorStatusTabProps) {
  const hasFraud = lead.isFraud;
  const hasErrors = false;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Col 1 — Fraud Checks + Errors */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="text-base text-foreground">Fraud & errors</span>
        </div>
        {[
          { label: "fraud check (check ip system)", message: hasFraud ? "*Problems with the key, api does not allow you to check the user ip" : "success!", type: hasFraud ? "error" : "success" },
          { label: "fraud check (autologin system)", message: "*system dont have click from autologin check!", type: "warning" },
          { label: "fraud check (check referer system)", message: "*system dont have click from autologin check!", type: "warning" },
          { label: "fraud check (check useragent (bot) system)", message: "*system dont have click from autologin check!", type: "warning" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{item.label}</span>
            <div className={cn(
              "px-3 py-2 rounded-md text-sm",
              item.type === "error" && "bg-red-500/10 text-red-600 dark:text-red-400",
              item.type === "warning" && "bg-yellow-500/10 text-yellow-600 dark:text-yellow-500",
              item.type === "success" && "bg-green-500/10 text-green-600 dark:text-green-400",
            )}>
              {item.message}
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">errors</span>
          <div className={cn(
            "px-3 py-2 rounded-md text-sm",
            hasErrors ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-green-500/10 text-green-600 dark:text-green-400"
          )}>
            success!
          </div>
        </div>
      </div>

      {/* Col 2 — Lead Rout + Status History */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-base text-foreground">Lead rout</span>
          </div>
          <div className="flex flex-col divide-y divide-gray-1000">
            {[
              { label: "campaign", value: lead.funnel ?? "—" },
              { label: "partner", value: lead.partner?.name ?? "—" },
              { label: "broker", value: lead.broker?.name ?? "—" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-500">{row.label}</span>
                <span className="text-sm text-blue-600 dark:text-blue-400">{row.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground">Status history</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="px-1 py-1 text-sm text-green-600 dark:text-green-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"} : status &quot;{lead.status}&quot;</span>
          </div>
        </div>
      </div>

      {/* Col 3 — Broker/Partner Answer */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="text-base text-foreground whitespace-nowrap">Broker/Partner answer (add lead)</span>
        </div>
        <Textarea label="Broker answer" rows={7} readOnly />
        <Textarea label="Partner answer" rows={7} readOnly />
      </div>
    </div>
  );
}
