"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { fetchClient } from "@/shared/api";
import { Card } from "./card";
import { SectionHeading } from "@/shared/ui/section-heading";
import { Skeleton } from "@/shared/ui/skeleton";
import { type LeadsFiltersState, filtersToApiBody } from "../types";
import { Users, CheckCircle, XCircle, Banknote, PhoneMissed, TrendingUp, AlertCircle } from "lucide-react";

interface LeadsOverviewProps {
  filters: LeadsFiltersState;
}

export function LeadsOverview({ filters }: LeadsOverviewProps) {
  const t = useTranslations("leads");
  const { data, isLoading } = useQuery({
    queryKey: ["leads-statistics", filters],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data, error } = await fetchClient.POST("/leads/get-statistics", {
        body: filtersToApiBody(filters),
      });
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { label: t("stats.total"),    value: data?.total     ?? 0, icon: Users },
    { label: t("stats.accepted"), value: data?.accepted  ?? 0, icon: CheckCircle },
    { label: t("stats.rejected"), value: data?.rejected  ?? 0, icon: XCircle },
    { label: t("stats.deposits"), value: data?.deposits  ?? 0, icon: Banknote },
    { label: t("stats.noAnswer"), value: data?.noAnswer  ?? 0, icon: PhoneMissed, subValue: `${data?.noAnswerPercentage ?? 0}%` },
    { label: t("stats.cr"),       value: `${data?.cr     ?? 0}%`, icon: TrendingUp },
    { label: t("stats.invalid"),  value: data?.invalid   ?? 0, icon: AlertCircle },
  ];

  return (
    <section className="mb-8">
      <div className="mb-4">
        <SectionHeading title={t("overview")} />
      </div>

      <div className="grid grid-cols-7 gap-3">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-11 rounded-xl" />
            ))
          : stats.map((s) => (
              <Card key={s.label} label={s.label} value={s.value} subValue={s.subValue} icon={s.icon} />
            ))
        }
      </div>
    </section>
  );
}
