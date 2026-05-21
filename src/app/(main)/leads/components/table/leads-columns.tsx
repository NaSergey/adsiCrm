"use client";

import { ColumnDef } from "@tanstack/react-table";
import { cn } from "@/shared/lib/css";
import { type Lead } from "../../../../../shared/types/lead";

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
    cell: ({ row }) => (
      <span className="text-gray-400">{row.original.ftd ? t("yes") : t("no")}</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: t("columns.dateCreate"),
    cell: ({ row }) => (
      <span className="text-gray-400 text-sm">
        {row.original.createdAt ? new Date(row.original.createdAt).toLocaleDateString() : "-"}
      </span>
    ),
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
