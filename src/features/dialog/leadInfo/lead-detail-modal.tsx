"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";
import { type Lead } from "../../../app/leads/types";
import { LeadInfoTab, type LeadInfoTabRef } from "./components/lead-info-tab";
import { ErrorStatusTab } from "./components/error-status-tab";
import { AutologinScreenshotButton } from "./components/autologin-screenshot-button";
import { useLeadById } from "@/entities/api/use-lead";

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "lead_info" | "error_status";

export function LeadDetailModal({ lead, open, onOpenChange }: LeadDetailModalProps) {
  const t = useTranslations("leadDetail");
  const [activeTab, setActiveTab] = useState<Tab>("lead_info");
  const tabRef = useRef<LeadInfoTabRef>(null);
  const queryClient = useQueryClient();

  const tabs: { id: Tab; label: string }[] = [
    { id: "lead_info", label: t("tabLeadInfo") },
    { id: "error_status", label: t("tabErrorStatus") },
  ];

  const { data: fullLead } = useLeadById(lead?.id ?? null);

  useEffect(() => {
    if (fullLead) console.log("[Lead]", fullLead);
  }, [fullLead]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: async () => {
      const values = tabRef.current?.getValues();
      if (!values || !lead) return;
      const { error } = await fetchClient.PATCH("/leads/{id}", {
        params: { path: { id: String(lead.id) } },
        body: values,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lead", lead?.id] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    },
  });

  const { mutate: deleteLead, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!lead) return;
      const { error } = await fetchClient.DELETE("/leads/{id}", {
        params: { path: { id: String(lead.id) } },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    },
  });

  if (!lead) return null;

  const leadData = fullLead ?? lead;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-1100 border-gray-1000 max-w-7xl min-h-[70vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">Lead {lead.id}</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-1000">
          <div className="flex items-center gap-3">
            <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="w-fit" />
            <span className="text-black text-xs font-bold bg-blue-200 rounded px-1.5 py-0.5">
              {lead.id}
            </span>
            <span className="text-sm text-foreground">{lead.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
            </span>
            <AutologinScreenshotButton leadId={lead.id} />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto flex flex-col">
          {activeTab === "lead_info" && <LeadInfoTab ref={tabRef} lead={leadData} />}
          {activeTab === "error_status" && <ErrorStatusTab lead={leadData} />}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-1000">
          <Button className="w-full" variant="blue" onClick={() => save()} disabled={isSaving || isDeleting}>
            {isSaving ? t("saving") : t("save")}
          </Button>
          <Button className="w-full" variant="destructive" onClick={() => deleteLead()} disabled={isSaving || isDeleting}>
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
