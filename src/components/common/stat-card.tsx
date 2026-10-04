import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/formatters";

interface StatCardProps {
  label: string;
  value: number;
  format: "currency" | "fullCurrency" | "number";
  changePct?: number | null;
  hint?: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  format,
  changePct = null,
  hint = "vs last month",
  icon: Icon,
  iconClassName,
  className,
}: StatCardProps) {
  const hasChange = changePct !== null;
  const isPositive = (changePct ?? 0) >= 0;
  const formattedValue =
    format === "currency"
      ? formatCompactCurrency(value)
      : format === "fullCurrency"
        ? formatCurrency(value)
        : formatNumber(value);

  return (
    <div
      className={cn(
        "bg-card rounded-xl border p-5 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-muted-foreground text-sm font-medium">{label}</p>
        {Icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              iconClassName ?? "bg-brand-soft text-brand",
            )}
          >
            <Icon className="size-4.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="text-foreground mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {formattedValue}
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs">
        {hasChange ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium",
              isPositive ? "bg-success-soft text-success" : "bg-danger-soft text-danger",
            )}
          >
            {isPositive ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {isPositive ? "+" : ""}
            {changePct?.toFixed(1)}%
          </span>
        ) : null}
        <span className="text-muted-foreground">{hint}</span>
      </p>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-7 w-20" />
      <Skeleton className="mt-3 h-4 w-36" />
    </div>
  );
}
