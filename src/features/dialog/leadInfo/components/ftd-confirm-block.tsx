"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BadgeCheck, Clock, CircleDollarSign } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { useConfirmFtd } from "@/entities/api/use-confirm-ftd";
import { useAppToast } from "@/shared/lib/use-app-toast";
import { cn } from "@/shared/lib/css";

interface FtdConfirmBlockProps {
  leadId: number;
  ftd: boolean;
  ftdPending: boolean;
  ftdDate?: string;
}

const toneStyles = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  pending: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  neutral: "border-gray-1000 bg-gray-1000/20 text-gray-500",
} as const;

export function FtdConfirmBlock({ leadId, ftd, ftdPending, ftdDate }: FtdConfirmBlockProps) {
  const t = useTranslations("leadDetail");
  const appToast = useAppToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { confirmFtd, isPending } = useConfirmFtd({
    onSuccess: () => {
      setConfirmOpen(false);
      appToast.updated("lead");
    },
  });

  const tone: keyof typeof toneStyles = ftd ? "success" : ftdPending ? "pending" : "neutral";
  const Icon = ftd ? BadgeCheck : ftdPending ? Clock : CircleDollarSign;
  const title = ftd ? t("ftdConfirmed") : ftdPending ? t("ftdPendingTitle") : t("noFtd");

  return (
    <>
      <div
        className={cn(
          "sm:col-span-2 flex items-center gap-2.5 rounded-lg border px-3 py-2",
          toneStyles[tone],
        )}
      >
        <Icon className="size-4 shrink-0" />
        <span className="truncate text-sm font-medium">{title}</span>
        {ftd && ftdDate && (
          <span className="ml-auto shrink-0 text-xs opacity-70">{ftdDate}</span>
        )}
        {ftdPending && (
          <Button
            size="sm"
            variant="blue"
            className="ml-auto shrink-0"
            disabled={isPending}
            onClick={() => setConfirmOpen(true)}
          >
            {t("confirmFtd")}
          </Button>
        )}
      </div>

      {ftdPending && (
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={t("confirmFtdTitle")}
          description={t("confirmFtdDescription")}
          confirmLabel={isPending ? t("confirmingFtd") : t("confirmFtd")}
          isPending={isPending}
          onConfirm={() => confirmFtd(leadId)}
        />
      )}
    </>
  );
}
