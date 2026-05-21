"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";
import { type Lead } from "@/shared/types/lead";
import { LeadInfoTab, type LeadInfoTabRef } from "./components/lead-info-tab";
import { ErrorStatusTab } from "./components/error-status-tab";
import { AutologinScreenshotButton } from "./components/autologin-screenshot-button";
import { FingerprintButton } from "./components/fingerprint-button";
import { useLeadById } from "@/entities/api/use-lead";
import { useDeleteLead } from "@/entities/api/delete/use-delete-lead";
import { usePermissions } from "@/shared/lib/use-permissions";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { useAppToast } from "@/shared/lib/use-app-toast";

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Tab = "lead_info" | "error_status";

export function LeadDetailModal({ lead, open, onOpenChange }: LeadDetailModalProps) {
  const t = useTranslations("leadDetail");
  const { hasFeature } = usePermissions();
  const [activeTab, setActiveTab] = useState<Tab>("lead_info");
  const tabRef = useRef<LeadInfoTabRef>(null);
  const queryClient = useQueryClient();
  const canDeleteLead = hasFeature("delete_lead");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const appToast = useAppToast();

  const tabs: { id: Tab; label: string }[] = [
    { id: "lead_info", label: t("tabLeadInfo") },
    { id: "error_status", label: t("tabErrorStatus") },
  ];

  const { data: fullLead } = useLeadById(lead?.id ?? null);

  useEffect(() => {
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
  const { remove: deleteLead, isPending: isDeleting } = useDeleteLead({ onSuccess: () => { onOpenChange(false); appToast.deleted("lead"); } });

  if (!lead) return null;

  const leadData = fullLead ?? lead;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-1100 border-gray-1000 max-w-7xl h-[90svh] sm:h-auto sm:min-h-[80vh] p-0 gap-0 overflow-hidden flex flex-col">
        <DialogTitle className="sr-only">Lead {lead.id}</DialogTitle>

        {/* Header */}
        <div className="flex  md:px-0 px-2 md:pt-0 pt-2 flex-col pb-4 md:gap-2 gap-4 border-b border-gray-1000">
          {/* Строка 1: TabSwitcher + [на десктопе: ID email] + кнопки */}
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} className="w-fit shrink-0" />
              <span className="hidden sm:inline-block shrink-0 text-black text-xs font-bold bg-blue-200 rounded px-1.5 py-0.5">
                {lead.id}
              </span>
              <span className="hidden sm:block text-sm text-foreground truncate min-w-0">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="hidden sm:inline text-xs text-gray-500">
                {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
              </span>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                <AutologinScreenshotButton leadId={lead.id} />
                <FingerprintButton fingerprint={fullLead?.fingerprint} />
              </div>
            </div>
          </div>
          {/* Строка 2: только мобилка — ID + email + дата */}
          <div className="flex sm:hidden items-center gap-2 min-w-0">
            <span className="shrink-0 text-black text-xs font-bold bg-blue-200 rounded px-1.5 py-0.5">
              {lead.id}
            </span>
            <span className="text-sm text-foreground truncate flex-1 min-w-0">{lead.email}</span>
            <span className="text-xs text-gray-500 shrink-0">
              {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "—"}
            </span>
          </div>
        </div>

        {/* Tab Content */}
        <div className="py-4 md:px-0 px-2 flex-1 overflow-y-auto flex flex-col">
          {activeTab === "lead_info" && <LeadInfoTab ref={tabRef} lead={leadData} />}
          {activeTab === "error_status" && <ErrorStatusTab lead={leadData} />}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-2  border-t border-gray-1000">
          <Button className="w-full" variant="blue" onClick={() => {
            const dirty = tabRef.current?.isDirty() ?? false;
            save(undefined, { onSuccess: () => { if (dirty) appToast.updated("lead"); } });
          }} disabled={isSaving || isDeleting}>
            {isSaving ? t("saving") : t("save")}
          </Button>
          {canDeleteLead && (
            <Button className="w-full" variant="destructive" onClick={() => setConfirmOpen(true)} disabled={isSaving || isDeleting}>
              {t("delete")}
            </Button>
          )}
        </div>
      </DialogContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("confirmDeleteTitle")}
        description={t("confirmDeleteDescription")}
        confirmLabel={isDeleting ? t("deleting") : t("delete")}
        isPending={isDeleting}
        onConfirm={() => lead && deleteLead(lead.id)}
      />
    </Dialog>
  );
}
