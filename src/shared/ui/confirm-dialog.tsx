"use client";

import { TriangleAlert } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  isPending = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-sm">
        <div className="flex flex-col items-center text-center gap-3 pb-2">
          <div className="flex items-center justify-center size-12 rounded-full bg-red-500/10">
            <TriangleAlert className="size-6 text-red-500" />
          </div>
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={isPending}>
            {isPending ? "Deleting..." : confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
