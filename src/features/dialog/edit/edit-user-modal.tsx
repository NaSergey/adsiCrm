"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { fetchClient } from "@/shared/api";
import { usersQueryKey } from "@/features/dialog/create/create-user-modal";
import { useDeleteUser } from "@/entities/api/delete/use-delete-user";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: {
    id: number;
    login: string;
    email: string;
    role: string;
    comment?: string;
  } | null;
}

export function EditUserModal({ open, onOpenChange, user }: EditUserModalProps) {
  const t = useTranslations("editModals");
  const [name, setName] = useState(user?.login ?? "");
  const [comment, setComment] = useState(user?.comment ?? "");
  const [password, setPassword] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);


  const queryClient = useQueryClient();

  const { mutate: update, isPending: isUpdating, error: updateError } = useMutation({
    mutationFn: (body: { name: string; comment: string; password?: string; permissions: [] }) =>
      fetchClient.PATCH("/users/{id}", { params: { path: { id: user!.id } }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      onOpenChange(false);
    },
  });

  const { remove, isPending: isDeleting } = useDeleteUser({ onSuccess: () => onOpenChange(false) });

  const handleSave = () => {
    const body: { name: string; comment: string; password?: string; permissions: [] } = { name, comment, permissions: [] };
    if (password) body.password = password;
    update(body);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {user && (
        <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-2xl">
          <DialogTitle></DialogTitle>
          <SectionHeading title={t("editUser")} />

          <div className="grid grid-cols-2 md:gap-4 gap-2 pt-4">
            <Input label={t("name")} placeholder={t("usernamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={t("email")} type="email" value={user.email} readOnly />
            <Input label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
            <Input label={t("role")} value={user.role} readOnly />
          </div>
          <div className="flex items-center gap-2 -mt-1 pb-4">
            <Input label={t("password")} type="password" placeholder={t("newPasswordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {updateError && (
            <p className="text-sm text-red-500 pb-2">{t("error")}</p>
          )}
          <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            <Button onClick={handleSave} disabled={!name || isUpdating || isDeleting}>
              {isUpdating ? t("saving") : t("save")}
            </Button>
            <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={isUpdating || isDeleting}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("confirmDeleteTitle")}
        description={t("confirmDeleteDescription")}
        confirmLabel={isDeleting ? t("deleting") : t("delete")}
        isPending={isDeleting}
        onConfirm={() => user && remove(user.id)}
      />
    </Dialog>
  );
}
