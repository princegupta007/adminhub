"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltipShell } from "@/components/common/chart-tooltip";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import type { RevenuePoint } from "../types";

interface RevenueChartProps {
  data: RevenuePoint[];
}

interface TooltipPayloadItem {
  payload: RevenuePoint;
}

function RevenueTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <ChartTooltipShell label={point.month}>
      <p className="text-foreground font-semibold">{formatCurrency(point.revenue)}</p>
      <p className="text-muted-foreground">{point.orders} orders</p>
    </ChartTooltipShell>
  );
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-64 w-full sm:h-72">
      {/* Mobile: Bar Chart */}
      <div className="block h-full w-full sm:hidden">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef5" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={8}
            />
            <YAxis
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={48}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: "#f1f3f9" }} />
            <Bar dataKey="revenue" fill="#6c7ee1" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Desktop: Area Chart */}
      <div className="hidden h-full w-full sm:block">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6c7ee1" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#6c7ee1" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef5" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              dy={8}
            />
            <YAxis
              tickFormatter={(value: number) => formatCompactCurrency(value)}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              width={56}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ stroke: "#c9cee6" }} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#6c7ee1"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#6c7ee1",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
