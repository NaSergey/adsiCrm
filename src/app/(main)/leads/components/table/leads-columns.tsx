"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useFormatter } from "next-intl";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/css";
import { type Lead } from "../../../../../shared/types/lead";

function DateCell({ value }: { value: string | undefined }) {
  const format = useFormatter();
  if (!value) return <span className="text-gray-400 text-sm">-</span>;
  return (
    <span className="text-gray-400 text-sm">
      {format.dateTime(new Date(value), { day: "2-digit", month: "2-digit", year: "numeric" })}
    </span>
  );
}

export type { Lead };

const StatusBadge = ({ status }: { status: string }) => {
  const badgeClasses = cn(
    "inline-block px-2 py-1 rounded text-xs font-medium",
    status === "Active"
      ? "bg-green-500/20 text-green-400"
      : status === "Pending"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-gray-500/20 text-gray-400"
  );

  return <span className={badgeClasses}>{status}</span>;
};

type T = (key: string) => string;

export interface LeadsColumnsOptions {
  onOpenPartner: (id: number) => void;
  onOpenBroker: (id: number) => void;
  /** When active, the FTD column becomes an interactive deposit-confirm checkbox. */
  ftdConfirm?: {
    active: boolean;
    confirmingId: number | null;
    onConfirm: (id: number) => void;
  };
}

export const getLeadsColumns = (t: T, opts: LeadsColumnsOptions): ColumnDef<Lead>[] => [
  {
    accessorKey: "id",
    header: t("columns.id"),
    cell: ({ row }) => (
      <span className="text-black text-[11px] font-bold bg-blue-200 rounded px-1 py-0.5">{row.original.id}</span>
    ),
  },
  {
    accessorKey: "status",
    header: t("columns.status"),
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "ftd",
    header: t("columns.ftd"),
    cell: ({ row }) => {
      const fc = opts.ftdConfirm;
      if (!fc?.active) {
        return <span className="text-gray-400">{row.original.ftd ? t("yes") : t("no")}</span>;
      }
      const confirming = fc.confirmingId === row.original.id;
      return (
        <button
          type="button"
          disabled={confirming}
          onClick={(e) => { e.stopPropagation(); fc.onConfirm(row.original.id); }}
          className={cn(
            "relative inline-flex items-center justify-center rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-green-500",
            confirming && "cursor-wait",
          )}
        >
          <span className={cn(confirming && "opacity-0")}>{t("ftdConfirmTitle")}</span>
          {confirming && <Loader2 className="absolute size-3.5 animate-spin" />}
        </button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: t("columns.dateCreate"),
    cell: ({ row }) => <DateCell value={row.original.createdAt} />,
  },
  {
    accessorKey: "email",
    header: t("columns.email"),
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm truncate max-w-xs">
        {row.original.email}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: t("columns.phone"),
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "funnel",
    header: t("columns.funnel"),
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">{row.original.funnel || "-"}</span>
    ),
  },
  {
    accessorKey: "country",
    header: t("columns.geoLang"),
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">
        {row.original.country ? `${row.original.country} ${row.original.language || ""}` : "-"}
      </span>
    ),
  },
  {
    accessorKey: "partner",
    header: t("columns.partner"),
    cell: ({ row }) => {
      const p = row.original.partner;
      if (!p) return <span className="text-gray-400 text-sm">-</span>;
      return (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); opts.onOpenPartner(p.id); }}
          className="text-gray-400 text-sm cursor-pointer hover:text-white hover:underline underline-offset-2"
        >
          {p.name}
        </button>
      );
    },
  },
  {
    accessorKey: "broker",
    header: t("columns.broker"),
    cell: ({ row }) => {
      const b = row.original.broker;
      if (!b) return <span className="text-gray-400 text-sm">-</span>;
      return (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); opts.onOpenBroker(b.id); }}
          className="text-gray-400 text-sm cursor-pointer hover:text-white hover:underline underline-offset-2"
        >
          {b.name}
        </button>
      );
    },
  },
  {
    accessorKey: "isFraud",
    header: t("columns.fraud"),
    cell: ({ row }) => (
      <span
        className={cn(
          "text-xs font-medium px-2 py-1 rounded",
          row.original.isFraud
            ? "bg-red-500/20 text-red-400"
            : "bg-green-500/20 text-green-400"
        )}
      >
        {row.original.isFraud ? t("yes") : t("no")}
      </span>
    ),
  },
];
