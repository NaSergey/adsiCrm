"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { API_ENDPOINTS } from "@/shared/api/config";

interface AutologinScreenshotButtonProps {
  leadId: number;
}

export function AutologinScreenshotButton({ leadId }: AutologinScreenshotButtonProps) {
  const t = useTranslations("leadDetail");
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function handleClick() {
    setOpen(true);
    setLoading(true);
    setImageUrl(null);
    setError(null);
    try {
      const res = await fetch(API_ENDPOINTS.leads.autologinImage(leadId), {
        credentials: "include",
      });
      if (!res.ok) {
        setError(t("noAutologinImage"));
        return;
      }
      const blob = await res.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch {
      setError(t("failedToLoadImage"));
    } finally {
      setLoading(false);
    }
  }
  console.log("AutologinScreenshotButton rendered with leadId:", leadId,error );

  return (
    <>
      <Button variant="outline" className="h-7 text-xs px-2" onClick={handleClick}>
        {t("autologinScreenshot")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-1100 border-gray-1000 max-w-2xl p-4 gap-0">
          <DialogTitle className="text-sm text-foreground mb-3">{t("autologinScreenshot")}</DialogTitle>
          {loading && <p className="text-sm text-gray-500">{t("loading")}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {imageUrl && <img src={imageUrl} alt={t("autologinScreenshot")} className="w-full rounded-md" />}
        </DialogContent>
      </Dialog>
    </>
  );
}
