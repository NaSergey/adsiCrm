"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus, MousePointerClick, X, Trash2 } from "lucide-react";
import { UsersSection } from "./components/users-section";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Button } from "@/shared/ui/button";
import { CreateUserModal } from "@/features/dialog/create/create-user-modal";
import { useDeleteUser } from "@/entities/api/delete/use-delete-user";

export default function UsersPage() {
  const t = useTranslations("users");
  const [createOpen, setCreateOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { remove: deleteUsers, isPending: isDeleting } = useDeleteUser({
    onSuccess: () => {
      setSelectedIds(new Set());
      setIsSelecting(false);
    },
  });

  const toggleId = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  function exitSelect() {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeading title={t("title")} />
        <div className="flex items-center gap-2">
          {isSelecting && selectedIds.size > 0 && (
            <Button size="sm" variant="destructive" className="" disabled={isDeleting} onClick={() => deleteUsers(Array.from(selectedIds))}>
              <Trash2 className="size-4" />
              {isDeleting ? t("deleting") : `${t("deleteSelected")} (${selectedIds.size})`}
            </Button>
          )}
          <Button
            size="sm"
            variant={isSelecting ? "ghostActive" : "secondary"}
            className=""
            onClick={isSelecting ? exitSelect : () => setIsSelecting(true)}
          >
            {isSelecting ? <X className="size-4" /> : <MousePointerClick className="size-4" />}
            {isSelecting ? t("cancelSelect") : t("select")}
          </Button>
          <Button size="sm" className="" onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            <div className="hidden md:block">
              {t("newUser")}
            </div>
          </Button>
        </div>
      </div>
      <UsersSection isSelecting={isSelecting} selectedIds={selectedIds} onToggleId={toggleId} />
      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
