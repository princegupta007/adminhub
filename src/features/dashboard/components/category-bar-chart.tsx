"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltipShell } from "@/components/common/chart-tooltip";
import { formatCompactCurrency } from "@/lib/formatters";
import type { CategoryPoint } from "../types";

export function CategoryBarChart({ data }: { data: CategoryPoint[] }) {
  return (
    <div className="h-64 w-full sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef5" />
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#6b7280" }}
            interval={0}
            angle={-18}
            dy={8}
            height={44}
          />
          <YAxis
            tickFormatter={(value: number) => String(value)}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "#6b7280" }}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(108, 126, 225, 0.06)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0].payload as CategoryPoint;
              return (
                <ChartTooltipShell label={point.category}>
                  <p className="text-foreground font-semibold">
                    {point.bookings} bookings
                  </p>
                  <p className="text-muted-foreground">
                    {formatCompactCurrency(point.revenue)} value
                  </p>
                </ChartTooltipShell>
              );
            }}
          />
          <Bar dataKey="bookings" fill="#9662b8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
