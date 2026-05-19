"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { SectionHeading } from "@/shared/ui/section-heading";
import { SelectManager } from "@/entities";
import { fetchClient } from "@/shared/api";
import { generateToken } from "@/shared/api/utils";
import { extractErrorMessage } from "@/shared/lib/extract-error-message";
import { usersQueryKey } from "./create-user-modal.constants";
import { useCreateUserOptions } from "./use-create-user-options";

export { usersQueryKey };

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateUserModal({ open, onOpenChange, onSuccess }: CreateUserModalProps) {
  const t = useTranslations("createModals");
  const { roleOptions, partnersDisplayOptions, leadsDisplayOptions, brokersDisplayOptions, accessBrokerOptions } = useCreateUserOptions();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [password, setPassword] = useState(() => generateToken(20));
  const [partnersDisplay, setPartnersDisplay] = useState("all");
  const [leadsDisplay, setLeadsDisplay] = useState("full");
  const [brokersDisplay, setBrokersDisplay] = useState("all");
  const [accessCreateBroker, setAccessCreateBroker] = useState("false");
  const [managerId, setManagerId] = useState("");

  const queryClient = useQueryClient();

  const resetForm = () => {
    setName("");
    setRole("");
    setEmail("");
    setComment("");
    setPassword(generateToken(20));
    setPartnersDisplay("all");
    setLeadsDisplay("full");
    setBrokersDisplay("all");
    setAccessCreateBroker("false");
    setManagerId("");
  };

  type Permission = "full_leads_display" | "full_brokers_display" | "full_partners_display" | "access_to_create_broker";

  const buildPermissions = (): Permission[] => {
    const permissions: Permission[] = [];
    if (role === "MANAGER") {
      if (partnersDisplay === "all") permissions.push("full_partners_display");
      if (leadsDisplay === "full") permissions.push("full_leads_display");
    } else if (role === "BRAND_MANAGER") {
      if (brokersDisplay === "all") permissions.push("full_brokers_display");
      if (leadsDisplay === "full") permissions.push("full_leads_display");
      if (accessCreateBroker === "true") permissions.push("access_to_create_broker");
    }
    return permissions;
  };

  const { mutate, isPending, error } = useMutation({
    mutationFn: async () => {
      const { data, error } = await fetchClient.POST("/users", {
        body: {
          name,
          email,
          comment,
          password,
          role: role as "ADMIN" | "MANAGER" | "PARTNER" | "INTEGRATOR" | "BRAND_MANAGER",
          permissions: buildPermissions(),
          managerId: role === "PARTNER" && managerId ? Number(managerId) : null,
        },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const emailError = email && !isValidEmail(email) ? t("emailInvalid") : undefined;
  const passwordError = password && password.length < 6 ? t("passwordTooShort") : undefined;
  const canSubmit = name && role && isValidEmail(email) && password.length >= 6;
  const errorMessage = extractErrorMessage(error) ?? t("error");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-md">
        <DialogTitle></DialogTitle>
        <SectionHeading title={t("createUser")} />

        <div className="flex flex-col gap-4 py-4">
          <Input label={`${t("name")}*`} placeholder={t("name")} value={name} onChange={(e) => setName(e.target.value)} />
          <Select label={`${t("role")}*`} options={roleOptions} placeholder={t("selectRole")} value={role} onChange={setRole} className="w-full" />

          {role === "MANAGER" && (
            <>
              <Select label={t("partnersDisplay")} options={partnersDisplayOptions} value={partnersDisplay} onChange={setPartnersDisplay} className="w-full" />
              <Select label={t("leadsDisplay")} options={leadsDisplayOptions} value={leadsDisplay} onChange={setLeadsDisplay} className="w-full" />
            </>
          )}

          {role === "PARTNER" && (
            <SelectManager label={t("manager")} value={managerId} onChange={setManagerId} />
          )}

          {role === "BRAND_MANAGER" && (
            <>
              <Select label={t("brokersDisplay")} options={brokersDisplayOptions} value={brokersDisplay} onChange={setBrokersDisplay} className="w-full" />
              <Select label={t("leadsDisplay")} options={leadsDisplayOptions} value={leadsDisplay} onChange={setLeadsDisplay} className="w-full" />
              <Select label={t("accessCreateBroker")} options={accessBrokerOptions} value={accessCreateBroker} onChange={setAccessCreateBroker} className="w-full" />
            </>
          )}

          <Input label={`${t("email")}*`} required type="email" placeholder={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
          <Textarea label={t("comment")} placeholder={t("comment")} value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          <Input label={`${t("password")}*`} placeholder={t("password")} value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />

          {error && (
            <p className="text-sm text-red-500">{errorMessage}</p>
          )}
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={() => mutate()} disabled={!canSubmit || isPending}>
            {isPending ? t("creating") : t("addUser")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
