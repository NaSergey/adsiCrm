import { type ColumnDef } from "@tanstack/react-table";
import type { components } from "@/shared/api/schema";

export type UserItem = components["schemas"]["ResponseUserDto"];

type T = (key: string) => string;

export const getUsersColumns = (t: T): ColumnDef<UserItem>[] => [
  { accessorKey: "id", header: t("columns.id"), size: 80 },
  { accessorKey: "name", header: t("columns.name") },
  { accessorKey: "email", header: t("columns.email") },
  { accessorKey: "role", header: t("columns.role") },
  {
    accessorKey: "createdAt",
    header: t("columns.createdAt"),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
  },
];
