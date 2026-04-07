"use client";

import { useState } from "react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/css";

// ─── mock data (replace with real API calls) ───
const PRODUCT_INFO = {
  subscribe_type: "Pro",
  date_to: "2026-12-31",
  access: true,
};
const USER_INFO = { login: "admin", role: "super_admin" };
const VERSION = "1.4.2";

// ─── helpers ──────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-1000 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-sm text-foreground font-medium">{children}</div>
    </div>
  );
}

function Badge({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
      active ? "bg-green-500/15 text-green-600 dark:text-green-400" : "bg-red-500/15 text-red-600 dark:text-red-400"
    )}>
      {children}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-1000 bg-gray-1100 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-gray-1000 bg-gray-1200">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</span>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}

// ─── DB Modal ─────────────────────────────────

interface DbConfig {
  host: string;
  user: string;
  pass: string;
  name: string;
}

function DbModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [cfg, setCfg] = useState<DbConfig>({ host: "localhost", user: "", pass: "", name: "" });
  const [answer, setAnswer] = useState("");

  const update = (field: keyof DbConfig, value: string) =>
    setCfg((p) => ({ ...p, [field]: value }));

  const handleSave = async () => {
    setAnswer("");
    // await apiRequest("/system_config/set_db_config", cfg)
    setAnswer("success");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-1100 border-gray-1000 max-w-md">
        <DialogTitle className="text-base font-semibold text-foreground">Database connection</DialogTitle>
        <div className="flex flex-col gap-3 pt-2">
          {(["host", "user", "pass", "name"] as const).map((field) => (
            <Input
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              type={field === "pass" ? "password" : "text"}
              value={cfg[field]}
              onChange={(e) => update(field, e.target.value)}
            />
          ))}
          {answer && (
            <p className={cn("text-sm text-center", answer === "success" ? "text-green-400" : "text-red-400")}>
              {answer}
            </p>
          )}
          <Button className="w-full mt-1" onClick={handleSave}>Connect</Button>
          <p className="text-center text-xs text-gray-500">
            Need help? Contact{" "}
            <a href="https://t.me/trafpar" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              @trafpar
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main ─────────────────────────────────────

export function SystemTab() {
  const [configName, setConfigName] = useState("PIXEL CRM");
  const [dbOpen, setDbOpen] = useState(false);
  const [updatesInfo] = useState("You have the latest version!");

  return (
    <div className="space-y-4">

      {/* Product */}
      <Section title="Product">
        <Row label="Type">
          <span>{PRODUCT_INFO.subscribe_type} version</span>
        </Row>
        <Row label="Subscription end date">
          <Badge active>{PRODUCT_INFO.date_to}</Badge>
        </Row>
      </Section>

      {/* Cron */}
      <Section title="Cron">
        <Row label="Update leads cron">
          <Badge active={PRODUCT_INFO.access}>
            {PRODUCT_INFO.access ? "active" : "inactive"}
          </Badge>
        </Row>
      </Section>

      {/* User */}
      <Section title="User">
        <Row label="Login">
          <span>{USER_INFO.login}</span>
        </Row>
        <Row label="Role">
          <span className="text-blue-600 dark:text-blue-400">{USER_INFO.role}</span>
        </Row>
      </Section>

      {/* System */}
      <Section title="System">
        <div className="flex items-end gap-2 py-2.5 border-b border-gray-1000">
          <div className="flex-1">
            <Input label="Name" value={configName} onChange={(e) => setConfigName(e.target.value)} />
          </div>
          <Button className="shrink-0 h-9">Save</Button>
        </div>

        <div className="flex items-end gap-2 py-2.5 border-b border-gray-1000">
          <div className="flex flex-col gap-1.5 flex-1">
            <span className="text-xs font-medium text-gray-500">Logo</span>
            <label className="flex h-9 items-center rounded-md bg-gray-1000 px-3 text-sm text-gray-500 cursor-pointer hover:bg-gray-1000/80 transition-colors">
              <input type="file" accept="image/*" className="hidden" />
              Choose file…
            </label>
          </div>
          <Button className="shrink-0 h-9">Save</Button>
        </div>

        <Row label="Cache (drop-down lists)">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            Update cache
          </button>
        </Row>

        <Row label="Updates">
          <span className="text-gray-500">{updatesInfo}</span>
        </Row>

        <Row label="Version">
          <span>{VERSION}</span>
        </Row>

        <Row label="Database">
          <Button variant="outline" onClick={() => setDbOpen(true)} className="h-7 text-xs px-3">
            Show settings
          </Button>
        </Row>
      </Section>

      <DbModal open={dbOpen} onOpenChange={setDbOpen} />
    </div>
  );
}
