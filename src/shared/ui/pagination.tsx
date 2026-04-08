"use client";

import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/css";

export interface PaginationControlsProps {
  currentPage: number;
  isLastPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  children?: React.ReactNode;
  hasMorePages?: boolean;
  disabled?: boolean;
}

export function PaginationControls({
  currentPage,
  isLastPage,
  onPageChange,
  className,
  children,
  hasMorePages,
  disabled = false,
}: PaginationControlsProps) {
  const pagination = React.useMemo(() => {
    if (isLastPage <= 1) return [];
    const pages: number[] = [];
    pages.push(1);

    if (currentPage - 1 > 1) {
      pages.push(currentPage - 1);
    }
    if (currentPage !== 1 && currentPage !== isLastPage) {
      pages.push(currentPage);
    }
    if (currentPage + 1 < isLastPage) {
      pages.push(currentPage + 1);
    }
    if (!pages.includes(isLastPage) && (hasMorePages || isLastPage > 1)) {
      pages.push(isLastPage);
    }

    return Array.from(new Set(pages)).sort((a, b) => a - b);
  }, [currentPage, isLastPage, hasMorePages]);

  if (isLastPage <= 1) return null;

  return (
    <div
      className={cn(
        "flex bg-gray-1100  px-4 py-3 items-center",
        children ? "justify-between" : "justify-end",
        className
      )}
    >
      {children && <div className="flex items-center">{children}</div>}

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="md"
          className="h-9 px-3"
          disabled={disabled || currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="ml-1">Previous</span>
        </Button>

        {pagination.map((p, i) => {
          const prev = pagination[i - 1];
          return (
            <React.Fragment key={p}>
              {prev && p - prev > 1 && (
                <div className="h-9 w-9 flex items-center justify-center text-gray-500">
                  <MoreHorizontal className="h-4 w-4" />
                </div>
              )}

              <button
                className={cn(
                  "h-9 w-9 flex items-center justify-center text-sm font-medium transition-colors duration-200 rounded-md",
                  disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                  p === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-1000"
                )}
                onClick={() => !disabled && onPageChange(p)}
                aria-current={p === currentPage ? "page" : undefined}
                disabled={disabled}
              >
                {p}
              </button>
            </React.Fragment>
          );
        })}

        <Button
          variant="ghost"
          size="md"
          className="h-9 px-3"
          disabled={disabled || currentPage >= isLastPage}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
