"use client";

import { useState } from "react";
import { MousePointerClick, X, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/css";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";

interface SelectionActionsProps {
  isSelecting: boolean;
  selectedCount: number;
  isDeleting?: boolean;
  onStartSelect: () => void;
  onExitSelect: () => void;
  onDelete: () => void;
  selectLabel?: string;
  cancelSelectLabel?: string;
  deleteLabel?: string;
  confirmTitle?: string;
  confirmDescription?: string;
  className?: string;
  children?: React.ReactNode;
}

export function SelectionActions({
  isSelecting,
  selectedCount,
  isDeleting = false,
  onStartSelect,
  onExitSelect,
  onDelete,
  selectLabel = "Select",
  cancelSelectLabel = "Cancel",
  deleteLabel = "Delete selected",
  confirmTitle = "Are you sure?",
  confirmDescription = "This action cannot be undone.",
  className,
  children,
}: SelectionActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        {isSelecting && children}
        {isSelecting && selectedCount > 0 && (
          <Button size="sm" variant="destructive" disabled={isDeleting} onClick={() => setConfirmOpen(true)}>
            <Trash2 className="size-4" />
            {`${deleteLabel} (${selectedCount})`}
          </Button>
        )}
        <Button
          size="sm"
          variant={isSelecting ? "ghostActive" : "secondary"}
          onClick={isSelecting ? onExitSelect : onStartSelect}
        >
          {isSelecting ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
          {isSelecting ? cancelSelectLabel : selectLabel}
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={confirmTitle}
        description={confirmDescription}
        isPending={isDeleting}
        onConfirm={() => { onDelete(); setConfirmOpen(false); }}
      />
    </>
  );
}
