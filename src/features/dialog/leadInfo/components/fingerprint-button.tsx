"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface FingerprintButtonProps {
  fingerprint?: Record<string, unknown> | null;
}

export function FingerprintButton({ fingerprint }: FingerprintButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" className="h-7 text-xs px-2" onClick={() => setOpen(true)}>
        Fingerprint
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-1100 border-gray-1000 max-w-2xl p-4 gap-0">
          <DialogTitle className="text-sm text-foreground mb-3">Fingerprint</DialogTitle>
          {!fingerprint || Object.keys(fingerprint).length === 0 ? (
            <p className="text-sm text-gray-500">No fingerprint data</p>
          ) : (
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-xs">
                <tbody>
                  {Object.entries(fingerprint).map(([key, value]) => (
                    <tr key={key} className="border-b border-gray-1000">
                      <td className="py-2 pr-4 text-gray-500 font-medium whitespace-nowrap align-top">{key}</td>
                      <td className="py-2 text-foreground break-all">
                        {typeof value === "object" && value !== null
                          ? JSON.stringify(value, null, 2)
                          : String(value ?? "—")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
