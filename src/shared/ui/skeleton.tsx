"use client";

import { cn } from "@/shared/lib/css";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-1000",
        className
      )}
      {...props}
    />
  );
}
