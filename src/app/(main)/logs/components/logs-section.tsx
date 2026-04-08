"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Download } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";
import { LogsFiltersBar, EMPTY_LOGS_FILTERS, type LogsFilters } from "./logs-filters";

export function LogsSection() {
  const t = useTranslations("logs");
  const [filters, setFilters] = useState<LogsFilters>(EMPTY_LOGS_FILTERS);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  async function search() {
    setIsLoading(true);
    setDownloadUrl(null);
    setError(false);

    const { data, error } = await fetchClient.GET("/api/logs", {
      params: { query: { date: filters.date, category: filters.category } },
    });

    if (error || !data?.downloadUrl) {
      setIsLoading(false);
      setError(true);
      return;
    }

    const fileName = data.downloadUrl;

    const res = await fetchClient.GET("/api/logs/download/{category}/{fileName}", {
      params: { path: { category: filters.category, fileName } },
      parseAs: "text",
    });

    setIsLoading(false);

    if (res.error) {
      setError(true);
      return;
    }

    setDownloadUrl(res.data as string);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { search(); }, []);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const blob = new Blob([downloadUrl], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filters.category}_${filters.date}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <LogsFiltersBar filters={filters} onChange={setFilters} onSearch={search} isLoading={isLoading} />

      {error && (
        <p className="text-sm text-red-500">{t("notFound")}</p>
      )}

      {downloadUrl && (
        <div className="flex flex-col gap-2 rounded-md border border-gray-200 dark:border-gray-1000 bg-white dark:bg-gray-1100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{filters.category} / {filters.date}</span>
            <Button size="md" variant="blue" onClick={handleDownload}>
              <Download className="size-4" />
              {t("download")}
            </Button>
          </div>
          <textarea
            readOnly
            value={downloadUrl}
            className="w-full bg-gray-100 dark:bg-gray-1000 rounded-md px-3 py-2 text-xs font-mono text-gray-900 dark:text-white resize-none outline-none"
            rows={20}
          />
        </div>
      )}
    </div>
  );
}
