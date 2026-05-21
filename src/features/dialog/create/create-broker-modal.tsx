"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SectionHeading } from "@/shared/ui/section-heading";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchClient } from "@/shared";
import { brokersQueryKey } from "@/entities";
import { extractErrorMessage } from "@/shared/lib/extract-error-message";
import { useAppToast } from "@/shared/lib/use-app-toast";
import { SelectBrandManager } from "@/entities/ui/select-brand-manager";

interface CreateBrokerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateBrokerModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateBrokerModalProps) {
  const t = useTranslations("createModals");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [managerId, setManagerId] = useState("");
  const appToast = useAppToast();

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body: { name: string; comment: string; brandManagerId?: number | null }) => {
      const { data, error } = await fetchClient.POST("/brokers", { body });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: brokersQueryKey });
      setName("");
      setComment("");
      setManagerId("");
      onOpenChange(false);
      onSuccess?.();
      appToast.created("broker");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-md">
        <DialogTitle></DialogTitle>
        <SectionHeading title={t("createBroker")} />

        <div className="flex flex-col gap-4 py-4">
          <Input label={t("name")} placeholder={t("brokerNamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
          <SelectBrandManager label={t("brandManager")} value={managerId} onChange={setManagerId} />
          {error && (
            <p className="text-sm text-red-500">{extractErrorMessage(error) ?? t("error")}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => mutate({ name, comment, brandManagerId: managerId ? Number(managerId) : null })}
            disabled={!name || isPending}
          >
            {isPending ? t("creating") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
