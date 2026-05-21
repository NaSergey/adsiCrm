"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Copy, Check } from "lucide-react";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { fetchClient } from "@/shared/api";
import { partnersQueryKey } from "@/entities/api/use-partners";
import { useDeletePartner } from "@/entities/api/delete/use-delete-partner";
import { SelectManager } from "@/entities";

export interface PartnerData {
  id: number;
  name: string;
  email: string;
  comment: string;
  partnerToken: string;
  role: string;
  managerId: string;
}

interface EditPartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: PartnerData;
}

export function EditPartnerModal({ open, onOpenChange, partner }: EditPartnerModalProps) {
  const t = useTranslations("editModals");
  const [name, setName] = useState(partner.name);
  const [comment, setComment] = useState(partner.comment);
  const [password, setPassword] = useState("");
  const [managerId, setManagerId] = useState(partner.managerId);
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(partner.partnerToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const queryClient = useQueryClient();


  const { mutate: update, isPending: isUpdating, error: updateError } = useMutation({
    mutationFn: (body: { name: string; comment: string; password?: string; permissions: []; managerId?: number | null }) =>
      fetchClient.PATCH("/users/{id}", { params: { path: { id: partner.id } }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnersQueryKey });
      onOpenChange(false);
    },
  });

  const { remove, isPending: isDeleting } = useDeletePartner({ onSuccess: () => onOpenChange(false) });

  const handleSave = () => {
    const body: { name: string; comment: string; password?: string; permissions: []; managerId?: number | null } = {
      name,
      comment,
      permissions: [],
      managerId: managerId ? Number(managerId) : null,
    };
    if (password) body.password = password;
    update(body);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-2xl">
        <DialogTitle></DialogTitle>
        <SectionHeading title={t("editPartner")} />

        <div className="grid grid-cols-2 md:gap-4 gap-2 py-4">
          <Input label={t("name")} placeholder={t("partnerNamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t("email")} type="email" value={partner.email} readOnly />
          <Input label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="flex items-end gap-2">
            <Input label={t("partnerToken")} value={partner.partnerToken} readOnly className="flex-1" />
            <button
              type="button"
              onClick={handleCopyToken}
              className="flex items-center cursor-pointer justify-center size-9 shrink-0 rounded-md transition-colors bg-gray-200 dark:bg-gray-1000 text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>
          <Input label={t("role")} value={partner.role} readOnly />
          <SelectManager label={t("manager")} value={managerId} onChange={setManagerId} />
          <div className="col-span-2">
            <Input label={t("password")} type="password" placeholder={t("newPasswordPlaceholder")} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {updateError && (
            <p className="col-span-2 text-sm text-red-500">{t("error")}</p>
          )}
        </div>

        <DialogFooter className="grid grid-cols-2 gap-3 sm:grid-cols-2">
          <Button onClick={handleSave} disabled={!name || isUpdating || isDeleting}>
            {isUpdating ? t("saving") : t("save")}
          </Button>
          <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={isUpdating || isDeleting}>
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("confirmDeleteTitle")}
        description={t("confirmDeleteDescription")}
        confirmLabel={isDeleting ? t("deleting") : t("delete")}
        isPending={isDeleting}
        onConfirm={() => remove(partner.id)}
      />
    </Dialog>
  );
}
