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

export interface LogItem {
  id: number | string;
  req_date: string;
  req_url: string;
  req_from: string;
  req_ip: string;
  req_headers: string;
  req_body: string;
  req_answer: string;
}

export function LogsTable({ data, isLoading }: { data: LogItem[]; isLoading?: boolean }) {
  const t = useTranslations("logs");
  const [expandedId, setExpandedId] = useState<number | string | null>(null);

  const toggle = (id: number | string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <Table>
      <TableHeader className="bg-gray-100 dark:bg-gray-1100 [&_tr]:border-gray-200 dark:[&_tr]:border-gray-1000">
        <TableRow className="border-gray-200 dark:border-gray-1000 hover:bg-transparent">
          <TableHead className="w-8 px-3 py-2.5" />
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.date")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.url")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.from")}</TableHead>
          <TableHead className="px-3 py-2.5 text-xs uppercase tracking-wide text-gray-500">{t("columns.ip")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i} className="border-gray-200 dark:border-gray-1000 hover:bg-transparent">
              <TableCell className="px-3 py-2.5" />
              {Array.from({ length: 4 }).map((_, j) => (
                <TableCell key={j} className="px-3 py-2.5">
                  <Skeleton className="h-4 w-full rounded" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : data.length === 0 ? (
          <TableRow className="border-0 hover:bg-transparent">
            <TableCell colSpan={5} className="py-10 text-center text-sm text-gray-500">
              {t("noData")}
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <React.Fragment key={item.id}>
                <TableRow
                  className="border-gray-200 dark:border-gray-1000 hover:bg-gray-50 dark:hover:bg-gray-1100 cursor-pointer transition-colors"
                  onClick={() => toggle(item.id)}
                >
                  <TableCell className="px-3 py-2.5 w-8">
                    {isOpen
                      ? <ChevronDown className="size-4 text-gray-400 transition-transform duration-200" />
                      : <ChevronRight className="size-4 text-gray-400 transition-transform duration-200" />}
                  </TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.req_date}</TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-gray-900 dark:text-white">{item.req_url}</TableCell>
                  <TableCell className="px-3 py-2.5 text-sm text-gray-900 dark:text-white">{item.req_from}</TableCell>
                  <TableCell className="px-3 py-2.5 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.req_ip}</TableCell>
                </TableRow>

                {/* Animated expand row */}
                <TableRow className={cn(
                  "hover:bg-transparent",
                  isOpen ? "border-gray-200 dark:border-gray-1000" : "border-0"
                )}>
                  <TableCell colSpan={5} className="p-0">
                    <div className={cn(
                      "grid transition-all duration-300 ease-in-out",
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}>
                      <div className="overflow-hidden">
                        <div className="px-4 py-4 bg-gray-50 dark:bg-gray-1100 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500">{t("headers")}</span>
                            <Textarea readOnly value={item.req_headers} className="text-xs min-h-24 font-mono" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500">{t("body")}</span>
                            <Textarea readOnly value={item.req_body} className="text-xs min-h-24 font-mono" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-gray-500">{t("answer")}</span>
                            <Textarea readOnly value={item.req_answer} className="text-xs min-h-24 font-mono" />
                          </div>
                        </div>
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
