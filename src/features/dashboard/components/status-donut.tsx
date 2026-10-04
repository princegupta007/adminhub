"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartTooltipShell } from "@/components/common/chart-tooltip";
import { formatNumber } from "@/lib/formatters";
import type { StatusSlice } from "../types";

const STATUS_COLORS: Record<string, string> = {
  paid: "#22a06b",
  completed: "#22a06b",
  pending: "#e5a80b",
  confirmed: "#4a8ddc",
  failed: "#e14d4d",
  cancelled: "#e14d4d",
};

interface StatusDonutProps {
  data: StatusSlice[];
  centerLabel: string;
  centerValue: string;
}

export function StatusDonut({ data, centerLabel, centerValue }: StatusDonutProps) {
  return (
    <div className="relative h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const slice = payload[0].payload as StatusSlice;
              return (
                <ChartTooltipShell label={slice.label}>
                  <p className="text-foreground font-semibold">
                    {formatNumber(slice.count)}
                  </p>
                </ChartTooltipShell>
              );
            }}
          />
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            innerRadius="62%"
            outerRadius="85%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((slice) => (
              <Cell key={slice.status} fill={STATUS_COLORS[slice.status] ?? "#9c9db2"} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-foreground text-2xl font-semibold tabular-nums">
          {centerValue}
        </p>
        <p className="text-muted-foreground text-xs">{centerLabel}</p>
      </div>
    </div>
  );
}
