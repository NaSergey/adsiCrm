"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, CheckCircle, XCircle, FileText } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/shared/ui/dialog";
import { TabSwitcher } from "@/shared/ui/tab-switcher";
import { PaginationControls } from "@/shared/ui/pagination";
import { DataTable } from "@/shared/ui/data-table";
import { fetchClient } from "@/shared/api";

type Tab = "import" | "history";

interface ImportResult {
  total: number;
  imported: number;
  notImported: number;
  notImportedRows: unknown;
}

interface CsvRow {
  [key: string]: string;
}

interface CsvData {
  columns: ColumnDef<CsvRow>[];
  rows: CsvRow[];
  file: File;
}

interface ImportedLead {
  firstName: string;
  lastName: string;
  email: string;
  password?: string | null;
  phone: string;
  country: string;
  language: string;
  ip: string;
  utmComment?: string | null;
  utmContent?: string | null;
  funnel?: string | null;
}

function parseCsv(text: string, file: File): CsvData {
  const lines = text.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    return Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ""]));
  });
  const columns: ColumnDef<CsvRow>[] = headers.map((h) => ({
    accessorKey: h,
    header: h,
  }));
  return { columns, rows, file };
}

const HISTORY_COLUMNS: ColumnDef<ImportedLead>[] = [
  { accessorKey: "firstName", header: "First Name" },
  { accessorKey: "lastName", header: "Last Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "language", header: "Language" },
  { accessorKey: "ip", header: "IP" },
  { accessorKey: "funnel", header: "Funnel", cell: ({ getValue }) => getValue() ?? "—" },
];

export function LeadsImportButton() {
  const t = useTranslations("leads");
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("import");

  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const [historyPage, setHistoryPage] = useState(1);
  const [historyData, setHistoryData] = useState<{ items: ImportedLead[]; meta: { totalPages: number; currentPage: number; totalItems: number } } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistory = async (page: number) => {
    setHistoryLoading(true);
    try {
      const { data } = await fetchClient.GET("/api/leads-import", {
        params: { query: { page } },
      });
      if (data) setHistoryData(data as typeof historyData);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setTab("import");
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    if (newTab === "history") {
      setHistoryPage(1);
      loadHistory(1);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setCsvData(parseCsv(text, file));
    setResult(null);
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!csvData) return;
    setImporting(true);
    try {
      const formData = new FormData();
      formData.append("file", csvData.file);
      const { data, error } = await fetchClient.POST("/api/leads-import", {
        body: { file: csvData.file as unknown as string },
        bodySerializer: () => formData,
      });
      if (error) throw error;
      setResult(data);
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCsvData(null);
    setResult(null);
    setHistoryData(null);
  };

  const tabs = [
    { id: "import" as Tab, label: t("import") },
    { id: "history" as Tab, label: t("importHistory") },
  ];

  return (
    <>
      <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFileChange} />

      <Button variant="ghost" size="md" onClick={handleOpen} disabled={importing}>
        <Download />
        {importing ? t("importing") : t("import")}
      </Button>

      <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
        <DialogContent className="bg-white dark:bg-gray-1100 border-gray-200 dark:border-gray-1000 max-w-7xl p-0 overflow-hidden gap-0 flex flex-col h-[90vh]">
          <DialogTitle className="sr-only">{t("import")}</DialogTitle>

          <div className="px-6 pt-5 pb-4 flex flex-col gap-4 overflow-y-auto flex-1 ">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-gray-900 dark:text-white">{t("import")}</p>
              <TabSwitcher tabs={tabs} activeTab={tab} onTabChange={handleTabChange} />
            </div>

            {tab === "import" && (
              <>
                {result ? (
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-1000 px-3 py-2">
                      <FileText className="size-4 text-gray-500" />
                      <span className="text-xs text-gray-500">{t("stats.total")}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.total}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-green-500/10 px-3 py-2">
                      <CheckCircle className="size-4 text-green-500" />
                      <span className="text-xs text-gray-500">{t("imported")}</span>
                      <span className="text-sm font-semibold text-green-500">{result.imported}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-red-500/10 px-3 py-2">
                      <XCircle className="size-4 text-red-500" />
                      <span className="text-xs text-gray-500">{t("failed")}</span>
                      <span className="text-sm font-semibold text-red-500">{result.notImported}</span>
                    </div>
                  </div>
                ) : null}

                {csvData && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">{csvData.rows.length} {t("stats.total")}</p>
                    <div className="overflow-auto max-h-[45vh]">
                      <DataTable columns={csvData.columns} data={csvData.rows} />
                    </div>
                  </div>
                )}

                {result && Array.isArray(result.notImportedRows) && result.notImportedRows.length > 0 && (
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500">{t("failedRows")}</p>
                    <pre className="rounded-md bg-gray-100 dark:bg-gray-1000 p-3 text-xs text-gray-900 dark:text-white overflow-auto max-h-32">
                      {JSON.stringify(result.notImportedRows, null, 2)}
                    </pre>
                  </div>
                )}
              </>
            )}

            {tab === "history" && (
              <div className="flex flex-col gap-2">
                <div className="overflow-auto max-h-[50vh]">
                  <DataTable
                    columns={HISTORY_COLUMNS}
                    data={historyData?.items ?? []}
                    isLoading={historyLoading}
                  />
                </div>
                {historyData && (
                  <PaginationControls
                    currentPage={historyPage}
                    isLastPage={historyData.meta.totalPages}
                    onPageChange={(page) => { setHistoryPage(page); loadHistory(page); }}
                    disabled={historyLoading}
                  />
                )}
              </div>
            )}
          </div>

          <DialogFooter className="border-t border-gray-200 dark:border-gray-1000 p-4">

            {tab === "import" && !result && csvData && (
              <Button variant="blue" className="flex-1" onClick={handleImport} disabled={importing}>
                {importing && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />}
                {importing ? t("importing") : t("import")}
              </Button>
            )}
            {tab === "import" && !result && (
              <Button variant="outline" className="flex-1" onClick={() => inputRef.current?.click()} disabled={importing}>
                <Download className="size-4" />
                {csvData ? csvData.file.name : t("selectFile")}
              </Button>
            )}
            {tab === "import" && result && (
              <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setCsvData(null); }}>
                {t("importAgain")}
              </Button>
            )}
            <Button variant="outline" className="flex-1" onClick={handleClose}>{t("close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
