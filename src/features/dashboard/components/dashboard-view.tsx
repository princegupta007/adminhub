"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useTodayLabel } from "@/lib/use-now";
import { CalendarCheck, CreditCard, Users as UsersIcon, Wallet } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { TopbarSearch } from "@/components/common/topbar-search";
import { ChartCard } from "@/components/common/chart-card";
import { StatCard, StatCardSkeleton } from "@/components/common/stat-card";
import { ErrorState } from "@/components/common/error-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStats } from "../hooks";
import { RevenueOverviewCard } from "./revenue-overview-card";
import { RecentTransactions } from "./recent-transactions";
import { SystemAlerts } from "./system-alerts";
import { SystemHealth } from "./system-health";
import { TopProducts } from "./top-products";
import { StatusDonut } from "./status-donut";
import { CategoryBarChart } from "./category-bar-chart";

const VALID_TABS = ["overview", "analytics", "reports", "settings"] as const;

export function DashboardView() {
  const { stats, isPending, error, refetch } = useDashboardStats();
  const todayLabel = useTodayLabel();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tabs are URL-driven so deep links like /?tab=settings work
  // (e.g. from the account menu) without extra effects.
  const tabParam = searchParams.get("tab") ?? "overview";
  const tab = (VALID_TABS as readonly string[]).includes(tabParam)
    ? tabParam
    : "overview";

  const kpis = useMemo(() => stats?.kpis ?? [], [stats]);
  const pendingTransactions = stats?.totals.pendingOrders ?? 0;

  return (
    <AppShell
      title="Welcome back, Sarah"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
    >
      <Tabs
        value={tab}
        onValueChange={(value) => router.replace(`/?tab=${value}`, { scroll: false })}
      >
        <div className="border-b">
          <TabsList className="h-auto gap-1 rounded-none border-0 bg-transparent p-0">
            {["overview", "analytics", "reports", "settings"].map((value) => (
              <TabsTrigger
                key={value}
                value={value}
                // The mobile design only shows Overview / Analytics / Reports.
                className={
                  value === "settings"
                    ? "data-[state=active]:border-brand data-[state=active]:text-brand hidden rounded-none border-0 bg-transparent px-4 py-2.5 text-sm capitalize shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none lg:inline-flex"
                    : "data-[state=active]:border-brand data-[state=active]:text-brand rounded-none border-0 bg-transparent px-4 py-2.5 text-sm capitalize shadow-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                }
              >
                {value}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {error ? (
          <div className="mt-6">
            <ErrorState
              title="Couldn't load the dashboard"
              description="We failed to fetch the data from the API. Check your connection and try again."
              onRetry={() => void refetch()}
            />
          </div>
        ) : (
          <TabsContent value="overview" className="mt-6 space-y-6">
            <section
              aria-label="Key metrics"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {isPending
                ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                : kpis.map((kpi) => (
                    <StatCard
                      key={kpi.id}
                      // Mobile order: users, bookings, revenue, orders
                      className={
                        kpi.id === "bookings"
                          ? "order-2 xl:order-none"
                          : kpi.id === "revenue"
                            ? "order-3 xl:order-none"
                            : kpi.id === "pending"
                              ? "order-4 xl:order-none"
                              : "order-1"
                      }
                      label={kpi.label}
                      value={kpi.value}
                      format={kpi.format === "percent" ? "number" : kpi.format}
                      changePct={kpi.changePct}
                      hint={kpi.hint}
                      icon={
                        kpi.id === "revenue"
                          ? Wallet
                          : kpi.id === "bookings"
                            ? CalendarCheck
                            : kpi.id === "pending"
                              ? CreditCard
                              : UsersIcon
                      }
                      iconClassName={
                        kpi.id === "revenue"
                          ? "bg-success-soft text-success"
                          : kpi.id === "bookings"
                            ? "bg-gold-soft text-gold"
                            : kpi.id === "pending"
                              ? "bg-purple-soft text-purple"
                              : "bg-brand-soft text-brand"
                      }
                    />
                  ))}
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <RevenueOverviewCard
                data={stats?.revenueByMonth ?? []}
                loading={isPending}
                className="xl:col-span-2"
              />
              <SystemAlerts pendingTransactions={pendingTransactions} />
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <RecentTransactions
                transactions={stats?.recentTransactions}
                loading={isPending}
                className="xl:col-span-2"
              />
              <SystemHealth />
            </section>
          </TabsContent>
        )}

        <TabsContent value="analytics" className="mt-6 space-y-6">
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <ChartCard
              title="Orders by Status"
              subtitle="All transactions grouped by payment status"
              className="xl:col-span-1"
            >
              {isPending ? null : (
                <StatusDonut
                  data={stats?.ordersByStatus ?? []}
                  centerLabel="total orders"
                  centerValue={String(stats?.totals.orders ?? 0)}
                />
              )}
            </ChartCard>
            <ChartCard
              title="Bookings by Category"
              subtitle="Most requested service categories"
              className="xl:col-span-2"
            >
              <CategoryBarChart data={stats?.bookingsByCategory ?? []} />
            </ChartCard>
          </section>
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            <TopProducts products={stats?.topProducts ?? []} className="xl:col-span-1" />
            <ChartCard
              title="Booking Status Breakdown"
              subtitle="Confirmed, pending, completed and cancelled"
              className="xl:col-span-2"
            >
              <CategoryBarChart
                data={(stats?.bookingsByStatus ?? []).map((slice) => ({
                  category: slice.label,
                  bookings: slice.count,
                  revenue: slice.amount,
                }))}
              />
            </ChartCard>
          </section>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsPanel data={stats?.revenueByMonth ?? []} loading={isPending} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsPanel />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ReportsPanel({
  data,
  loading,
}: {
  data: { month: string; revenue: number; orders: number }[];
  loading: boolean;
}) {
  const totalRevenue = data.reduce((sum, point) => sum + point.revenue, 0);
  const totalOrders = data.reduce((sum, point) => sum + point.orders, 0);

  return (
    <ChartCard
      title="Monthly Report"
      subtitle="Revenue and order volume by month (last 12 months)"
    >
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-muted h-8 animate-pulse rounded" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
                <th className="py-2 pr-4 font-medium">Month</th>
                <th className="py-2 pr-4 text-right font-medium">Orders</th>
                <th className="py-2 pr-4 text-right font-medium">Revenue</th>
                <th className="py-2 text-right font-medium">Avg / Order</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.month} className="border-b last:border-0">
                  <td className="py-2.5 pr-4 font-medium">{point.month}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{point.orders}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">
                    ${point.revenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td className="py-2.5 text-right tabular-nums">
                    $
                    {point.orders > 0
                      ? (point.revenue / point.orders).toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })
                      : 0}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 font-semibold">
                <td className="py-2.5 pr-4">Total</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">{totalOrders}</td>
                <td className="py-2.5 pr-4 text-right tabular-nums">
                  ${totalRevenue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  $
                  {totalOrders > 0
                    ? (totalRevenue / totalOrders).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })
                    : 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </ChartCard>
  );
}

function SettingsPanel() {
  return (
    <ChartCard title="Workspace Settings" subtitle="Preferences for this admin workspace">
      <form className="grid max-w-xl gap-4" onSubmit={(event) => event.preventDefault()}>
        <label className="grid gap-1.5 text-sm font-medium">
          Workspace name
          <input
            type="text"
            defaultValue="AdminHub"
            className="bg-card focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm font-normal shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium">
          Support email
          <input
            type="email"
            defaultValue="support@adminhub.io"
            className="bg-card focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm font-normal shadow-xs focus-visible:ring-[3px] focus-visible:outline-none"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-brand hover:bg-brand-strong focus-visible:ring-ring/50 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium text-white transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          >
            Save changes
          </button>
          <button
            type="reset"
            className="bg-card hover:bg-muted focus-visible:ring-ring/50 inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
          >
            Reset
          </button>
        </div>
      </form>
    </ChartCard>
  );
}
