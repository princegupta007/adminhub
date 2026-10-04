"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Filter } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/common/data-table";
import { EmptyState } from "@/components/common/empty-state";
import { Pagination } from "@/components/common/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TransactionStatusBadge } from "@/components/common/status-badge";
import { useTransactionColumns } from "@/features/transactions/components/transaction-columns";
import type { Transaction } from "@/features/transactions/types";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import { APP_CONSTANTS, APP_ROUTES } from "@/lib/constants";

const FILTER_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
] as const;

interface RecentTransactionsProps {
  transactions: Transaction[] | undefined;
  loading: boolean;
  className?: string;
}

export function RecentTransactions({
  transactions = [],
  loading,
  className,
}: RecentTransactionsProps) {
  const columns = useTransactionColumns();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      statusFilter === "all"
        ? transactions
        : transactions.filter((t) => t.status === statusFilter),
    [transactions, statusFilter],
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / APP_CONSTANTS.DASHBOARD_PAGE_SIZE),
  );
  const safePage = Math.min(page, totalPages);
  const rows = filtered.slice(
    (safePage - 1) * APP_CONSTANTS.DASHBOARD_PAGE_SIZE,
    safePage * APP_CONSTANTS.DASHBOARD_PAGE_SIZE,
  );

  const activeLabel =
    FILTER_OPTIONS.find((option) => option.value === statusFilter)?.label ??
    "All statuses";

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-base">Recent Transactions</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "bg-card text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                statusFilter !== "all" && "border-brand text-brand",
              )}
            >
              <Filter className="size-3.5" aria-hidden="true" />
              Filter
              {statusFilter !== "all" ? (
                <span className="text-brand">· {activeLabel}</span>
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {FILTER_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => {
                    setStatusFilter(option.value);
                    setPage(1);
                  }}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mobile: compact list layout (per the mobile design) */}
        {!loading && rows.length > 0 ? (
          <ul className="divide-border divide-y sm:hidden">
            {rows.map((row) => (
              <li key={row.id}>
                <Link
                  href={`/transactions/${row.id}`}
                  className="hover:bg-muted/60 focus-visible:ring-ring/50 -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-medium">
                      {row.customerFirstName} {row.customerLastName}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">
                      #{row.id} •{" "}
                      {new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-foreground text-sm font-semibold tabular-nums">
                      {formatCurrency(row.discountedAmount)}
                    </span>
                    <TransactionStatusBadge status={row.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="hidden sm:block">
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            getRowHref={(row) => `/transactions/${row.id}`}
            loading={loading}
            empty={
              <EmptyState
                title="No transactions found"
                description={
                  statusFilter === "all"
                    ? "Transactions will appear here once orders come in."
                    : "No transactions match the selected status."
                }
                actionLabel="Clear filter"
                onAction={() => setStatusFilter("all")}
              />
            }
            caption="Recent transactions"
          />
        </div>
        {!loading && filtered.length > 0 ? (
          <>
            <div className="hidden sm:block">
              <Pagination
                page={safePage}
                pageSize={APP_CONSTANTS.DASHBOARD_PAGE_SIZE}
                total={filtered.length}
                itemLabel="results"
                onPageChange={setPage}
              />
            </div>
            <Link
              href={APP_ROUTES.TRANSACTIONS}
              className="text-brand hover:text-brand-strong focus-visible:ring-ring/50 flex items-center justify-center gap-1 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none sm:hidden"
            >
              View All
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
