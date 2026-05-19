"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";
import { LogsFiltersBar, EMPTY_LOGS_FILTERS, type LogsFilters } from "./logs-filters";
import { LogsTable, type LogItem } from "./logs-table";


export function LogsSection() {
  const t = useTranslations("logs");
  const [filters, setFilters] = useState<LogsFilters>(EMPTY_LOGS_FILTERS);
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [rawText, setRawText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function search() {
    setIsLoading(true);
    setRawText(null);
    setError(false);

    const { data, error } = await fetchClient.GET("/logs", {
      params: { query: { date: filters.date, category: filters.category } },
    });

    if (error || !data?.downloadUrl) {
      setIsLoading(false);
      setError(true);
      return;
    }

    setFileName(data.downloadUrl);

    const res = await fetchClient.GET("/logs/download/{category}/{fileName}", {
      params: { path: { category: filters.category, fileName: data.downloadUrl } },
      parseAs: "text",
    });

    setIsLoading(false);

    if (res.error) {
      setError(true);
      return;
    }

    const text = res.data as string;
    setRawText(text);

    try {
      const parsed: LogItem[] = JSON.parse(text);
      setLogs(Array.isArray(parsed) ? parsed : []);
    } catch {
      setLogs([]);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { search(); }, []);

  const handleDownload = () => {
    if (!rawText) return;
    const blob = new Blob([rawText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName ?? `${filters.category}_${filters.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <LogsFiltersBar filters={filters} onChange={setFilters} onSearch={search} isLoading={isLoading} />

      <div className="rounded-lg border border-gray-200 dark:border-gray-1000 bg-white dark:bg-gray-1100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-1000">
          <span className="text-sm text-gray-500">{filters.category} / {filters.date}</span>
          {rawText && (
            <Button size="md" variant="blue" onClick={handleDownload}>
              <Download className="size-4" />
              {t("download")}
            </Button>
          )}
        </div>
        <LogsTable data={logs} isLoading={isLoading} />
      </div>
    </div>
  );
}
