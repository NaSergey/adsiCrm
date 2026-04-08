"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading?: boolean;
  className?: string;
  rowClassName?: string | ((row: TData) => string);
  onRowClick?: (row: TData) => void;
  loadingContent?: React.ReactNode;
  noDataContent?: React.ReactNode;
  onErrorContent?: React.ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  className = "",
  rowClassName = "",
  onRowClick,
  loadingContent,
  noDataContent,
  onErrorContent,
}: DataTableProps<TData>) {
  "use no memo";
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border border-gray-1000 overflow-hidden">
      <Table className={className}>
        <TableHeader className="bg-gray-1000">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              className="hover:bg-transparent"
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-10 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wide"
                >
                  {header.isPlaceholder ? null : (
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className={cn(
                        "flex items-center gap-1.5 select-none",
                        header.column.getCanSort()
                          ? "cursor-pointer hover:text-gray-900 dark:hover:text-white"
                          : "cursor-default"
                      )}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="inline-flex">
                          {header.column.getIsSorted() === "desc" ? (
                            <ChevronDown className="size-3.5" />
                          ) : header.column.getIsSorted() === "asc" ? (
                            <ChevronUp className="size-3.5" />
                          ) : (
                            <div className="size-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {onErrorContent ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {onErrorContent}
              </TableCell>
            </TableRow>
          ) : isLoading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {loadingContent ?? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                {noDataContent ?? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </div>
                )}
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className={cn(typeof rowClassName === "function" ? rowClassName(row.original) : rowClassName)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
