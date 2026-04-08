"use client";

import { useForm, useWatch, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { SectionHeading } from "@/shared/ui/section-heading";
import { fetchClient } from "@/shared/api";
import { extractErrorMessage } from "@/shared/lib/extract-error-message";
import type { components } from "@/shared/api/schema";
import { SelectPartner, SelectBroker, SelectManager } from "@/entities";
import { SelectCountryMulti } from "@/entities/ui/select-country-multi";
import { SelectLangMulti } from "@/entities/ui/select-lang-multi";
import { ScheduleDropdown } from "@/features/dialog/components/schedule-dropdown";
import { campaignFormSchema, type CampaignFormValues } from "@/features/dialog/schemas/campaign-schema";

type CreateCampaignBody = components["schemas"]["CreateCampaignDto"];

export const campaignsQueryKey = ["campaigns"] as const;

const STATUS_OPTIONS = [
  { value: "ON", label: "ON" },
  { value: "OFF", label: "OFF" },
];

const DAY_MAP: Record<string, string> = {
  Mo: "mon", Tu: "tue", We: "wed", Th: "thu", Fr: "fri", Sa: "sat", Su: "sun",
};

interface CreateCampaignModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateCampaignModal({ open, onOpenChange, onSuccess }: CreateCampaignModalProps) {
  const t = useTranslations("createModals");
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "", cap: "", comment: "",
      countries: [], languages: [],
      partnerId: "", brokerId: "", managerId: "",
      status: "ON",
      checkerFunnel: false, funnelData: "",
      activeDays: [], timeFrom: "", timeTo: "", timezone: "UTC",
    },
  });

  const checkerFunnel = useWatch({ control, name: "checkerFunnel" });

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (body: CreateCampaignBody) => {
      const { data, error } = await fetchClient.POST("/campaigns", { body });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const onSubmit = (values: CampaignFormValues) => {
    const isScheduleEnabled = values.activeDays.length > 0;
    const workingHours = isScheduleEnabled
      ? Object.fromEntries(
          values.activeDays.map((d) => [
            DAY_MAP[d],
            { start: values.timeFrom || "00:00", end: values.timeTo || "23:30" },
          ])
        )
      : {};

    mutate({
      name: values.name,
      comment: values.comment,
      dailyCap: Number(values.cap),
      partnerId: values.partnerId ? Number(values.partnerId) : null,
      brokerId: Number(values.brokerId),
      managerId: values.managerId ? Number(values.managerId) : null,
      isActive: values.status === "ON",
      funnel: values.funnelData,
      checkFunnel: values.checkerFunnel,
      countries: values.countries,
      languages: values.languages,
      isScheduleEnabled,
      timezone: values.timezone || "UTC",
      workingHours,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-4xl">
        <DialogTitle className="sr-only">{t("createCampaign")}</DialogTitle>

        <div className="flex items-center justify-between">
          <SectionHeading title={t("createCampaign")} />
          <ScheduleDropdown
            onScheduleChange={(data) => {
              setValue("activeDays", data.activeDays);
              setValue("timeFrom", data.timeFrom);
              setValue("timeTo", data.timeTo);
              setValue("timezone", data.timezone);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-4">
            <Input
              label={t("name")}
              placeholder={t("campaignNamePlaceholder")}
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label={t("cap")}
              type="number"
              placeholder={t("dailyCapPlaceholder")}
              error={errors.cap?.message}
              {...register("cap")}
            />
            <Input label={t("comment")} placeholder={t("comment")} {...register("comment")} />
            <Controller
              name="countries"
              control={control}
              render={({ field }) => (
                <SelectCountryMulti label={t("countries")} value={field.value} onChange={field.onChange} />
              )}
            />
            <Controller
              name="languages"
              control={control}
              render={({ field }) => (
                <SelectLangMulti label={t("languages")} value={field.value} onChange={field.onChange} />
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Controller
              name="partnerId"
              control={control}
              render={({ field }) => (
                <SelectPartner label={t("partner")} value={field.value} onChange={field.onChange} />
              )}
            />
            <Controller
              name="brokerId"
              control={control}
              render={({ field }) => (
                <SelectBroker
                  label={t("broker")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.brokerId?.message}
                />
              )}
            />
            <Controller
              name="managerId"
              control={control}
              render={({ field }) => (
                <SelectManager label={t("manager")} value={field.value} onChange={field.onChange} />
              )}
            />
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select label={t("status")} options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} />
              )}
            />
            <div className="flex flex-col -mt-1 gap-2">
              <Controller
                name="checkerFunnel"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={t("checkerFunnel")}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
              {checkerFunnel && (
                <Input className="mt-0.5 py-2" placeholder={t("funnelDataPlaceholder")} {...register("funnelData")} />
              )}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500">{extractErrorMessage(error) ?? t("error")}</p>
        )}

        <DialogFooter>
          <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={isPending}>
            {isPending ? t("creating") : t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
