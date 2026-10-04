import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton for chart cards — mimics axes and a jagged area/line shape. */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
      <div className="mt-6 flex gap-3">
        <div className="flex flex-col justify-between py-0.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-2 w-7" />
          ))}
        </div>
        <div className="flex-1">
          <Skeleton className="h-44 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for list-style cards (alerts, health metrics). */
export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="mt-0.5 size-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton rows for tables. */
export function TableSkeleton({ rows = 6, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2.5">
      <div
        className="grid gap-4 border-b pb-3"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="grid items-center gap-4 py-2"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: cols }).map((_, col) => (
            <Skeleton key={col} className={cnCol(col)} />
          ))}
        </div>
      ))}
    </div>
  );
}

function cnCol(col: number) {
  if (col === 0) return "h-9 w-9 rounded-full";
  if (col === 1) return "h-4 w-24";
  return "h-4 w-full max-w-28";
}
