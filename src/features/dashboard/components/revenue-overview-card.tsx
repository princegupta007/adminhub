"use client";

import { useState } from "react";

import { ChartCard } from "@/components/common/chart-card";
import { ChartSkeleton } from "@/components/common/skeletons";
import { cn } from "@/lib/utils";
import { RevenueChart } from "./revenue-chart";
import type { RevenuePoint } from "../types";

const RANGES = [
  { value: 1, label: "1M" },
  { value: 3, label: "3M" },
  { value: 6, label: "6M" },
] as const;

function formatRangeLabel(data: RevenuePoint[]): string {
  if (data.length < 2) return "";
  const first = data[0];
  const last = data[data.length - 1];
  const monthNames = new Intl.DateTimeFormat("en-US", { month: "short" });
  // Months repeat across a year; take them from the underlying dates is not
  // possible here, so approximate with the 12-month label cycle.
  void monthNames;
  return `${first.month} – ${last.month}`;
}

export function RevenueOverviewCard({
  data,
  loading,
  className,
}: {
  data: RevenuePoint[];
  loading: boolean;
  className?: string;
}) {
  const [range, setRange] = useState<number>(6);

  const monthly = data.slice(-12);
  const visible = monthly.slice(-range);
  const subtitle =
    monthly.length > 0
      ? `${formatRangeLabel(visible)} · last ${range} month${range > 1 ? "s" : ""}`
      : "";

  return (
    <ChartCard
      title="Revenue Overview"
      subtitle={loading ? "Loading revenue data…" : subtitle}
      className={className}
      action={
        <div
          className="bg-muted inline-flex items-center gap-0.5 rounded-full border p-0.5"
          role="group"
          aria-label="Chart range"
        >
          {RANGES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setRange(option.value)}
              aria-pressed={range === option.value}
              className={cn(
                "focus-visible:ring-ring/50 rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                range === option.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      }
    >
      {loading ? <ChartSkeleton /> : <RevenueChart data={visible} />}
    </ChartCard>
  );
}
