"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { usePermissions } from "@/shared/lib/use-permissions";
import { DialogFooter, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Checkbox } from "@/shared/ui/checkbox";
import { SectionHeading } from "@/shared/ui/section-heading";
import { ScheduleDropdown } from "@/features/dialog/components/schedule-dropdown";
import { SelectPartner } from "@/entities/ui/select-partner";
import { SelectBroker } from "@/entities/ui/select-broker";
import { SelectManager } from "@/entities/ui/select-manager";
import { SelectCountryMulti } from "@/entities/ui/select-country-multi";
import { SelectLangMulti } from "@/entities/ui/select-lang-multi";
import { fetchClient } from "@/shared/api";
import { campaignsQueryKey } from "@/features/dialog/create/create-campaign-modal";
import { useDeleteCampaign } from "@/entities/api/delete/use-delete-campaign";
import { campaignFormSchema, type CampaignFormValues } from "@/features/dialog/schemas/campaign-schema";

const STATUS_OPTIONS = [
  { value: "ON", label: "ON" },
  { value: "OFF", label: "OFF" },
];

const DAY_MAP: Record<string, string> = {
  Mo: "mon", Tu: "tue", We: "wed", Th: "thu", Fr: "fri", Sa: "sat", Su: "sun",
};

const REVERSE_DAY_MAP: Record<string, string> = {
  mon: "Mo", tue: "Tu", wed: "We", thu: "Th", fri: "Fr", sat: "Sa", sun: "Su",
};

export interface CampaignData {
  id: string;
  name: string;
  cap: string;
  comment: string;
  countries: string[];
  languages: string[];
  partnerId: string;
  brokerId: string;
  managerId: string;
  status: string;
  checkerFunnel: boolean;
  funnelData: string;
  isScheduleEnabled: boolean;
  timezone: string;
  workingHours: Record<string, { start: string; end: string }>;
}

interface EditCampaignFormProps {
  campaign: CampaignData;
  onSave?: () => void;
  onDelete?: () => void;
  onDuplicate?: (data: CampaignFormValues) => void;
}

export function buildEditFormValues(campaign: CampaignData): CampaignFormValues {
  const activeDays = campaign.isScheduleEnabled
    ? Object.keys(campaign.workingHours || {}).map((day) => REVERSE_DAY_MAP[day]).filter(Boolean)
    : [];
  const firstDay = Object.values(campaign.workingHours || {})[0];
  return {
    name: campaign.name,
    cap: campaign.cap,
    comment: campaign.comment,
    countries: campaign.countries,
    languages: campaign.languages,
    partnerId: campaign.partnerId,
    brokerId: campaign.brokerId,
    managerId: campaign.managerId,
    status: campaign.status === "ON" ? "ON" : "OFF",
    checkerFunnel: campaign.checkerFunnel,
    funnelData: campaign.funnelData,
    activeDays,
    timeFrom: campaign.isScheduleEnabled ? firstDay?.start ?? "" : "",
    timeTo: campaign.isScheduleEnabled ? firstDay?.end ?? "" : "",
    timezone: campaign.timezone || "UTC",
  };
}

export function EditCampaignForm({ campaign, onSave, onDelete, onDuplicate }: EditCampaignFormProps) {
  const { hasFeature } = usePermissions();
  const t = useTranslations("editModals");
  const queryClient = useQueryClient();

  const { control, register, handleSubmit, setValue, reset, getValues, formState: { errors } } = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: buildEditFormValues(campaign),
  });

  useEffect(() => {
    reset(buildEditFormValues(campaign));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.id]);

  const checkerFunnel = useWatch({ control, name: "checkerFunnel" });

  const { mutate: update, isPending } = useMutation({
    mutationFn: async (values: CampaignFormValues) => {
      const isScheduleEnabled = values.activeDays.length > 0;
      const workingHours = isScheduleEnabled
        ? Object.fromEntries(values.activeDays.map((d) => [DAY_MAP[d], { start: values.timeFrom || "00:00", end: values.timeTo || "23:30" }]))
        : {};
      const res = await fetchClient.PATCH("/campaigns/{id}", {
        params: { path: { id: Number(campaign.id) } },
        body: {
          name: values.name,
          dailyCap: Number(values.cap),
          comment: values.comment,
          countries: values.countries,
          languages: values.languages,
          isActive: values.status === "ON",
          funnel: values.funnelData,
          checkFunnel: values.checkerFunnel,
          isScheduleEnabled,
          timezone: values.timezone || "UTC",
          workingHours,
          ...(values.brokerId && { brokerId: Number(values.brokerId) }),
          ...(values.partnerId && { partnerId: Number(values.partnerId) }),
          ...(values.managerId && { managerId: Number(values.managerId) }),
        },
      });
      if (res.error) throw res.error;
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKey });
      onSave?.();
    },
  });

  const { remove, isPending: isDeleting } = useDeleteCampaign({ onSuccess: onDelete });

  return (
    <>
      <DialogTitle className="sr-only">{t("editCampaign")}</DialogTitle>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SectionHeading title={t("editCampaign")} />
          <span className="text-xs font-normal text-gray-500">#{campaign.id}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Duplicate campaign"
            onClick={() => onDuplicate?.(getValues())}
            className="flex items-center justify-center size-8 rounded-md transition-colors bg-gray-200 dark:bg-gray-1000 text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            <Copy className="size-4" />
          </button>
          <ScheduleDropdown
            initialData={{
              activeDays: campaign.isScheduleEnabled
                ? Object.keys(campaign.workingHours || {}).map((d) => REVERSE_DAY_MAP[d]).filter(Boolean)
                : [],
              timeFrom: campaign.isScheduleEnabled ? Object.values(campaign.workingHours || {})[0]?.start ?? "" : "",
              timeTo: campaign.isScheduleEnabled ? Object.values(campaign.workingHours || {})[0]?.end ?? "" : "",
              timezone: campaign.timezone || "UTC",
            }}
            onScheduleChange={(data) => {
              setValue("activeDays", data.activeDays);
              setValue("timeFrom", data.timeFrom);
              setValue("timeTo", data.timeTo);
              setValue("timezone", data.timezone);
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:gap-x-6 gap-x-3 gap-y-4">
        <div className="flex flex-col gap-4">
          <Input label={t("name")} placeholder={t("campaignNamePlaceholder")} error={errors.name?.message} {...register("name")} />
          <Input label={t("cap")} type="number" placeholder={t("capPlaceholder")} error={errors.cap?.message} {...register("cap")} />
          <Input label={t("comment")} placeholder={t("comment")} {...register("comment")} />
          <Controller name="countries" control={control} render={({ field }) => (
            <SelectCountryMulti label={t("countries")} value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="languages" control={control} render={({ field }) => (
            <SelectLangMulti label={t("languages")} value={field.value} onChange={field.onChange} />
          )} />
        </div>
        <div className="flex flex-col gap-4">
          <Controller name="partnerId" control={control} render={({ field }) => (
            <SelectPartner label={t("partner")} value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="brokerId" control={control} render={({ field }) => (
            <SelectBroker label={t("broker")} value={field.value} onChange={field.onChange} error={errors.brokerId?.message} />
          )} />
          <Controller name="managerId" control={control} render={({ field }) => (
            <SelectManager label={t("manager")} value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="status" control={control} render={({ field }) => (
            <Select label={t("status")} options={STATUS_OPTIONS} value={field.value} onChange={field.onChange} />
          )} />
          <div className="flex flex-col -mt-1 gap-2">
            <Controller name="checkerFunnel" control={control} render={({ field }) => (
              <Checkbox label={t("checkerFunnel")} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
            )} />
            <Input className="mt-0.5 py-2" placeholder={t("funnelDataPlaceholder")} disabled={!checkerFunnel} {...register("funnelData")} />
          </div>
        </div>
      </div>

      <DialogFooter className="flex-row gap-3 justify-between sm:justify-between">
        <Button className="flex-1" onClick={handleSubmit((v) => update(v))} disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </Button>
        {hasFeature("manage_campaigns") && (
          <Button variant="destructive" className="flex-1" onClick={() => remove(Number(campaign.id))} disabled={isDeleting}>
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        )}
      </DialogFooter>
    </>
  );
}

/** @deprecated Use CampaignModal instead */
export { EditCampaignForm as EditCampaignModal };
