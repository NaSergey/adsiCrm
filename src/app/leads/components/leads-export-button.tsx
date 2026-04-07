"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { fetchClient } from "@/shared/api";
import { type LeadsFiltersState, filtersToApiBody } from "../types";


interface LeadsExportButtonProps {
  filters: LeadsFiltersState;
}

export function LeadsExportButton({ filters }: LeadsExportButtonProps) {
  const t = useTranslations("leads");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const { data, error } = await fetchClient.POST("/leads/export-in-csv", {
        body: filtersToApiBody(filters),
      });
      if (error || !data?.downloadUrl) {
        setExportError(error ? JSON.stringify(error) : "No download URL returned");
        return;
      }

      const fileName = data.downloadUrl.split("/").pop()!;
      const res = await fetchClient.GET("/leads/downloadExportFile/{fileName}", {
        params: { path: { fileName } },
        parseAs: "blob",
      });
      if (res.response && !res.response.ok) {
        setExportError(`Download failed: ${res.response.status}`);
        return;
      }
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Button variant="ghost" size="md" onClick={handleExport} disabled={exporting}>
        <Upload />{exporting ? t("exporting") : t("export")}
      </Button>
      {exportError && (
        <p className="text-xs text-red-500 mt-1">{exportError}</p>
      )}
    </>
  );
}
