import { type ColumnDef } from "@tanstack/react-table";

export interface ServiceItem {
  id: number | string;
  login_email: string;
  ip: string;
  auth_time: string;
  last_connect_time: string;
}

export const serviceColumns: ColumnDef<ServiceItem>[] = [
  { accessorKey: "id", header: "ID", size: 80 },
  { accessorKey: "login_email", header: "Login Email" },
  { accessorKey: "ip", header: "IP" },
  { accessorKey: "auth_time", header: "Auth Time" },
  { accessorKey: "last_connect_time", header: "Last Connect Time" },
];
