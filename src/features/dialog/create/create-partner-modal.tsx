"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { SectionHeading } from "@/shared/ui/section-heading";
import { fetchClient } from "@/shared/api";
import type { components } from "@/shared/api/schema";
import { partnersQueryKey } from "@/entities/api/use-partners";
import { extractErrorMessage } from "@/shared/lib/extract-error-message";
import { SelectManager } from "@/entities";

type CreatePartnerBody = components["schemas"]["CreateUserDto"];

interface CreatePartnerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreatePartnerModal({ open, onOpenChange, onSuccess }: CreatePartnerModalProps) {
  const t = useTranslations("createModals");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState("");
  const [managerId, setManagerId] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body: CreatePartnerBody) => {
      const { data, error } = await fetchClient.POST("/users", { body });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnersQueryKey });
      setName("");
      setEmail("");
      setComment("");
      setPassword("");
      setManagerId("");
      onOpenChange(false);
      onSuccess?.();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-2xl">
        <DialogTitle></DialogTitle>
        <SectionHeading title={t("createPartner")} />

        <div className="grid grid-cols-2 gap-4 py-4">
          <Input label={t("name")} placeholder={t("partnerNamePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} />
          <Input label={t("email")} type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} />
          <Input label={t("password")} type="password" placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} />
          <SelectManager label={t("manager")} value={managerId} onChange={setManagerId} />
          {error && (
            <p className="col-span-2 text-sm text-red-500">{extractErrorMessage(error) ?? t("error")}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            className="w-full"
            disabled={!name || !email || !password || isPending}
            onClick={() =>
              mutate({
                name,
                email,
                comment,
                password,
                role: "PARTNER",
                permissions: [],
                managerId: managerId ? Number(managerId) : null,
              })
            }
          >
            {isPending ? t("creating") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
