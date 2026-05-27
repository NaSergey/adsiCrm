"use client";

import { Bookmark, Pencil } from "lucide-react";
import { useTranslations, useFormatter } from "next-intl";
import { Switch } from "@/shared/ui/switch";
import { useToggleCampaign } from "../hooks/use-toggle-campaign";
import type { Campaign } from "../types";

// Isolated — only this re-renders on toggle, not the whole card
function CampaignSwitch({ campaign }: { campaign: Campaign }) {
  const { isActive, toggle } = useToggleCampaign(campaign);
  return (
    <div className="mt-1 flex items-center gap-2">
      <Switch checked={isActive} onCheckedChange={toggle} aria-label="Toggle campaign" />
      <span className="inline-block rounded bg-yellow-100 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
        #{campaign.id}
      </span>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  isPinned: boolean;
  isSelecting?: boolean;
  isSelected?: boolean;
  onSelect: (id: number) => void;
  onEdit: (campaign: Campaign) => void;
  onBookmark: (id: number) => void;
  onBrokerClick: (campaign: Campaign) => void;
  onPartnerClick: (campaign: Campaign) => void;
}

export function CampaignCard({
  campaign,
  isPinned,
  isSelecting = false,
  isSelected = false,
  onSelect,
  onEdit,
  onBookmark,
  onBrokerClick,
  onPartnerClick,
}: CampaignCardProps) {
  const t = useTranslations("campaign");
  const format = useFormatter();

  return (
    <article
      className={`relative flex flex-col rounded-lg border bg-gray-1000 p-4 transition-colors ${
        isSelecting
          ? isSelected
            ? "border-green-1000 ring-2 ring-green-1000 cursor-pointer"
            : "border-gray-300 dark:border-gray-700 hover:border-green-1000 cursor-pointer"
          : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-700/80"
      }`}
      onClick={isSelecting ? () => onSelect(campaign.id) : undefined}
    >
      {isSelecting && <div className="absolute inset-0 z-10 rounded-lg" />}

      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
            {campaign.name}
          </h3>
          <CampaignSwitch campaign={campaign} />
        </div>
        <div className="flex shrink-0 gap-0.5">
          <button
            type="button"
            className={`rounded p-1 cursor-pointer transition-colors ${isPinned ? "text-green-1000" : "text-gray-400 hover:text-green-1000"}`}
            aria-label="Bookmark"
            onClick={() => onBookmark(campaign.id)}
          >
            <Bookmark className="size-4" fill={isPinned ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            className="rounded p-1 text-gray-400 cursor-pointer hover:text-green-1000"
            aria-label="Edit"
            onClick={() => onEdit(campaign)}
          >
            <Pencil className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 pb-3 text-sm">
        <button
          type="button"
          onClick={() => onBrokerClick(campaign)}
          className="group flex cursor-pointer w-full justify-between gap-2 border-b border-gray-200 dark:border-gray-700 hover:border-green-1000 transition-colors text-left"
        >
          <span className="shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-green-1000 transition-colors">{t("broker")}:</span>
          <span className="min-w-0 truncate text-right text-gray-900 dark:text-white group-hover:text-green-1000 transition-colors">
            {campaign.broker?.name ?? "—"}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onPartnerClick(campaign)}
          className="group flex cursor-pointer w-full justify-between gap-2 border-b border-gray-200 dark:border-gray-700 hover:border-green-1000 transition-colors text-left"
        >
          <span className="shrink-0 text-gray-500 dark:text-gray-400 group-hover:text-green-1000 transition-colors">{t("partner")}:</span>
          <span className="min-w-0 truncate text-right text-gray-900 dark:text-white group-hover:text-green-1000 transition-colors">
            {campaign.partner?.name ?? "—"}
          </span>
        </button>
        <div className="flex justify-between gap-2 border-b border-gray-200 dark:border-gray-700">
          <span className="shrink-0 text-gray-500 dark:text-gray-400">{t("cap")}:</span>
          <span className="text-right text-gray-900 dark:text-white">
            {campaign.currentDailyCount} / {campaign.dailyCap}
          </span>
        </div>
        <div className="flex justify-between gap-2 border-b border-gray-200 dark:border-gray-700">
          <span className="shrink-0 text-gray-500 dark:text-gray-400">{t("created")}:</span>
          <span className="text-right text-gray-900 dark:text-white">{format.dateTime(new Date(campaign.createdAt), { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
        </div>
      </div>
    </article>
  );
}
