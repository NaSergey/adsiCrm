"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/css";

export interface EmptyStateProps {
  title: string;
  description?: string;
  showIcon?: boolean;
  onReload?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  showIcon = false,
  onReload,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4",
        className
      )}
    >
      {showIcon && (
        <AlertCircle className="size-12 text-gray-500 mb-4" />
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6">{description}</p>
      )}
      {onReload && (
        <Button
          variant="blue"
          size="md"
          onClick={onReload}
        >
          Reload
        </Button>
      )}
    </div>
  );
}
