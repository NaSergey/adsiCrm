"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/css";
import { Textarea } from "@/shared/ui/textarea";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export interface LogItemData {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
  requestBody?: Record<string, unknown>;
  response?: unknown;
  error?: string;
  [key: string]: unknown;
}

export interface LogItem {
  timestamp: string;
  level: "success" | "error" | string;
  message: string;
  data?: LogItemData;
}

function fmt(val: unknown): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val;
  return JSON.stringify(val, null, 2);
}

function fmtTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
    const time = d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `${date} ${time}`;
  } catch {
    return iso;
  }
}

const LEVEL_CLS: Record<string, string> = {
  success: "bg-green-500/15 text-green-400",
  error:   "bg-red-500/15 text-red-400",
};

export function LogsTable({ data, isLoading }: { data: LogItem[]; isLoading?: boolean }) {
  const t = useTranslations("logs");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const toggle = (i: number) => setExpandedIdx((p) => (p === i ? null : i));

  return (
    <Table>
      <TableHeader className="bg-gray-100 dark:bg-gray-1100 [&_tr]:border-gray-200 dark:[&_tr]:border-gray-1000">
        <TableRow className="border-gray-200 dark:border-gray-1000 hover:bg-transparent">
          <TableHead className="w-8 px-3 py-2.5" />
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500 whitespace-nowrap">{t("columns.date")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.level")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.message")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.method")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.url")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-gray-200 dark:border-gray-1000 hover:bg-transparent">
              <TableCell className="px-3 py-2.5 w-8" />
              <TableCell className="px-3 py-2.5"><Skeleton className="h-4 w-36 rounded" /></TableCell>
              <TableCell className="px-3 py-2.5"><Skeleton className="h-5 w-16 rounded" /></TableCell>
              <TableCell className="px-3 py-2.5"><Skeleton className="h-4 w-48 rounded" /></TableCell>
              <TableCell className="px-3 py-2.5"><Skeleton className="h-4 w-12 rounded" /></TableCell>
              <TableCell className="px-3 py-2.5"><Skeleton className="h-4 w-40 rounded" /></TableCell>
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={6} className="py-10 text-center text-sm text-gray-500">
              {t("noData")}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item, i) => {
            const isOpen = expandedIdx === i;
            const levelCls = LEVEL_CLS[item.level] ?? "bg-gray-500/15 text-gray-400";
            return (
              <React.Fragment key={i}>
                <TableRow
                  className="border-gray-200 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1100 cursor-pointer transition-colors"
                  onClick={() => toggle(i)}
                >
                  <TableCell className="px-3 py-2.5 w-8">
                    {isOpen
                      ? <ChevronDown className="size-4 text-gray-400 transition-transform duration-200" />
                      : <ChevronRight className="size-4 text-gray-400 transition-transform duration-200" />}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap text-xs text-gray-500 font-mono">{fmtTimestamp(item.timestamp)}</TableCell>
                  <TableCell className="px-3 py-2.5">
                    <span className={cn("inline-flex items-center rounded px-2 py-0.5 text-xs font-medium", levelCls)}>
                      {item.level}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-gray-900 dark:text-white">{item.message}</TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-500">{item.data?.method ?? "—"}</TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-gray-500 max-w-48 truncate">{item.data?.url ?? "—"}</TableCell>
                </TableRow>

                {/* Expand row */}
                <TableRow className={cn(
                  "hover:bg-transparent",
                  isOpen ? "border-gray-200 dark:border-gray-1000" : "border-0"
                )}>
                  <TableCell colSpan={6} className="p-0">
                    <div className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}>
                      <div className="overflow-hidden">
                        {item.data?.method ? (
                          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-1100 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500">{t("headers")}</span>
                              <Textarea readOnly value={fmt(item.data?.headers)} className="text-xs min-h-46 font-mono" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500">{t("body")}</span>
                              <Textarea readOnly value={fmt(item.data?.requestBody)} className="text-xs min-h-46 font-mono" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-gray-500">{t("answer")}</span>
                              <Textarea
                                readOnly
                                value={item.data?.error ? fmt(item.data.error) : fmt(item.data?.response)}
                                className={cn("text-xs min-h-46 font-mono", item.data?.error && "text-red-400")}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-4 bg-gray-50 dark:bg-gray-1100">
                            <Textarea
                              readOnly
                              value={item.data ? fmt(item.data) : ""}
                              className="text-xs min-h-32 font-mono w-full"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
