import { Skeleton } from "@/shared/ui/skeleton";

export function LeadsTopRowSkeleton() {
  return (
    <>
        <Skeleton className="h-9 flex-1 rounded-md" />
    </>
  );
}

export function LeadsFilterRowSkeleton() {
  return (
    <>
        <Skeleton  className="h-9 flex-1 min-w-32 rounded-md" />
    </>
  );
}
