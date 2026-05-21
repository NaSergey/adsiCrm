"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, Pencil, Trash2, AlertCircle, X } from "lucide-react";
import { cn } from "@/shared/lib/css";

export type ToastType = "created" | "updated" | "deleted" | "error";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  show: (type: ToastType, title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const CONFIG: Record<ToastType, { icon: React.ElementType; color: string; border: string }> = {
  created: { icon: CheckCircle2, color: "text-green-500",  border: "border-l-green-500" },
  updated: { icon: Pencil,       color: "text-blue-400",   border: "border-l-blue-400" },
  deleted: { icon: Trash2,       color: "text-red-500",    border: "border-l-red-500" },
  error:   { icon: AlertCircle,  color: "text-yellow-500", border: "border-l-yellow-500" },
};

const DURATION = 4000;
const EXIT_MS = 220;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [leaving, setLeaving] = useState<Set<string>>(new Set());

  const dismiss = useCallback((id: string) => {
    setLeaving((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      setLeaving((prev) => { const next = new Set(prev); next.delete(id); return next; });
    }, EXIT_MS);
  }, []);

  const show = useCallback((type: ToastType, title: string, description?: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => dismiss(id), DURATION);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <style>{`
        @keyframes toast-slide-in {
          from { transform: translateX(calc(100% + 1rem)); opacity: 0; }
          to   { transform: translateX(0); opacity: 1; }
        }
        @keyframes toast-slide-out {
          from { transform: translateX(0); opacity: 1; }
          to   { transform: translateX(calc(100% + 1rem)); opacity: 0; }
        }
        .toast-enter { animation: toast-slide-in 0.2s ease-out; }
        .toast-leave { animation: toast-slide-out 0.2s ease-in forwards; }
      `}</style>
      <div className="fixed top-15 right-4 z-[300] flex flex-col gap-2 pointer-events-none w-72">
        {toasts.map((toast) => {
          const { icon: Icon, color, border } = CONFIG[toast.type];
          return (
            <div
              key={toast.id}
              className={cn(
                leaving.has(toast.id) ? "toast-leave" : "toast-enter",
                "pointer-events-auto",
                "flex items-start gap-3 rounded-lg border border-l-4 border-gray-1000 bg-gray-1100 p-3 shadow-xl",
                border,
              )}
            >
              <div className={cn("mt-px shrink-0", color)}>
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 mt-px text-gray-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
