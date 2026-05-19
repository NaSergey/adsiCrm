"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SectionHeading } from "@/shared/ui/section-heading";
import { EditIntegCodeModal } from "./edit-integ-code-modal";
import { fetchClient } from "@/shared/api";
import { brokersQueryKey } from "@/entities";
import { useDeleteBroker } from "@/entities/api/delete/use-delete-broker";
import { SelectBrandManager } from "@/entities/ui/select-brand-manager";
import { usePermissions } from "@/shared/lib/use-permissions";

export interface BrokerData {
  id: string;
  name: string;
  comment: string;
  managerId: string;
}

interface EditBrokerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  broker: BrokerData;
  onSuccess?: () => void;
  onDelete: () => void;
}

export function EditBrokerModal({
  open,
  onOpenChange,
  broker,
  onSuccess,
  onDelete,
}: EditBrokerModalProps) {
  const t = useTranslations("editModals");
  const { hasFeature } = usePermissions();
  const [name, setName] = useState(broker.name);
  const [comment, setComment] = useState(broker.comment);
  const [managerId, setManagerId] = useState(broker.managerId);
  const [integType, setIntegType] = useState<"add" | "update" | null>(null);

  useEffect(() => {
    setName(broker.name);
    setComment(broker.comment);
    setManagerId(broker.managerId);
  }, [broker]);

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      fetchClient.PATCH("/brokers/{id}", {
        params: { path: { id: Number(broker.id) } },
        body: {
          name,
          comment,
          brandManagerId: managerId ? Number(managerId) : null,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokersQueryKey });
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const { remove: deleteMutate, isPending: isDeleting } = useDeleteBroker({
    onSuccess: () => { onOpenChange(false); onDelete(); },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-2xl">
          <DialogTitle></DialogTitle>
          <SectionHeading title={t("editBroker")} />

          <div className="grid grid-cols-2 gap-6 pb-6 pt-4">
            <Input label={t("id")} value={broker.id} readOnly />
            <Input label={t("name")} placeholder={t("brokerNamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
            <Input label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
            <SelectBrandManager label={t("brandManager")} value={managerId} onChange={setManagerId} />
            {error && <p className="col-span-2 text-sm text-red-500">{t("error")}</p>}
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button onClick={() => mutate()} disabled={isPending} className="w-full sm:flex-1">
              {isPending ? t("saving") : t("save")}
            </Button>
            <Button variant="secondary" onClick={() => setIntegType("add")} className="w-full sm:flex-1">{t("addLeads")}</Button>
            <Button variant="secondary" onClick={() => setIntegType("update")} className="w-full sm:flex-1">{t("updateLeads")}</Button>
            {hasFeature("manage_affiliates") && (
              <Button variant="destructive" onClick={() => deleteMutate(Number(broker.id))} disabled={isDeleting} className="w-full sm:flex-1">
                {isDeleting ? t("deleting") : t("delete")}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {integType && (
        <EditIntegCodeModal
          open={integType !== null}
          onOpenChange={(o) => { if (!o) setIntegType(null); }}
          brokerId={broker.id}
          brokerName={broker.name}
          type={integType}
        />
      )}
    </>
  );
}
