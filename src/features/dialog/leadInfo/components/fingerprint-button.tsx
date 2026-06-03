"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { API_ENDPOINTS } from "@/shared/api/config";
import { getAccessToken } from "@/shared/lib/auth-token";

interface FingerprintButtonProps {
  leadId: number;
}

export function FingerprintButton({ leadId }: FingerprintButtonProps) {
  const t = useTranslations("leadDetail");
  const [open, setOpen] = useState(false);
  const [fingerprint, setFingerprint] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setOpen(true);
    setLoading(true);
    setFingerprint(null);
    setError(null);
    try {
      const token = getAccessToken();
      const res = await fetch(API_ENDPOINTS.leads.fingerprint(leadId), {
        credentials: "include",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        setError(t("noFingerprint"));
        return;
      }
      const data = await res.json();
      setFingerprint(data?.fingerprint ?? null);
    } catch {
      setError(t("failedToLoadFingerprint"));
    } finally {
      setLoading(false);
    }
  }

  const hasData = fingerprint && Object.keys(fingerprint).length > 0;

  return (
    <>
      <Button variant="outline" className="h-7 text-xs px-2" onClick={handleClick}>
        Fingerprint
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-1100 border-gray-1000 max-w-2xl p-4 gap-0">
          <DialogTitle className="text-sm text-foreground mb-3">Fingerprint</DialogTitle>
          {loading && <p className="text-sm text-gray-500">{t("loading")}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && !hasData && (
            <p className="text-sm text-gray-500">No fingerprint data</p>
          )}
          {!loading && !error && hasData && (
            <pre className="overflow-auto max-h-[60vh] rounded-md bg-gray-1200/40 p-3 font-mono text-xs leading-relaxed text-foreground whitespace-pre-wrap break-all">
              {JSON.stringify(fingerprint, null, 2)}
            </pre>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
