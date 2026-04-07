"use client";

import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/css";

type ConfirmVariant = "danger" | "success" | "warning";

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant?: ConfirmVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconBg: "bg-red-500/10 dark:bg-red-500/15",
    iconColor: "text-red-500",
    confirmVariant: "destructive" as const,
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-green-500/10 dark:bg-green-500/15",
    iconColor: "text-green-500",
    confirmVariant: "default" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
    iconColor: "text-amber-500",
    confirmVariant: "default" as const,
  },
};

export function ConfirmModal({
  open,
  onOpenChange,
  variant = "danger",
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
}: ConfirmModalProps) {
  const { icon: Icon, iconBg, iconColor, confirmVariant } = variantConfig[variant];

  const defaultConfirmLabel =
    variant === "danger" ? "Delete" : variant === "success" ? "Confirm" : "Continue";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-sm p-0 overflow-hidden gap-0">
        <DialogTitle className="sr-only">{title}</DialogTitle>

        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-6 text-center">
          <div className={cn("flex items-center justify-center w-16 h-16 rounded-full", iconBg)}>
            <Icon className={cn("w-8 h-8", iconColor)} strokeWidth={1.5} />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-base font-semibold text-gray-900 dark:text-white">{title}</p>
            {description && (
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            )}
          </div>
        </div>

        <DialogFooter className="border-t border-gray-200 dark:border-gray-1000 p-4 gap-2 sm:flex-row">
          <Button
            variant={confirmVariant}
            className="flex-1"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel ?? defaultConfirmLabel}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            {cancelLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
