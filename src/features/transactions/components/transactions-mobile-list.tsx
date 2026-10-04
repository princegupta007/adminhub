import Link from "next/link";
import { ArrowLeftRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/common/search-input";
import { MobileFilterDrawer } from "@/components/common/mobile-filter-drawer";
import { MiniStatCard } from "@/components/common/mini-stat-card";
import { MobileCard } from "@/components/common/mobile-card";
import { UserCell } from "@/components/common/user-cell";
import { TransactionStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { resetFilters, setFilter, setSearch } from "@/store/tables-slice";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import { formatDateTime } from "./transaction-columns";
import { getTransactionType, getTypeStyle } from "../utils";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";
import type { Transaction, TransactionStatus } from "../types";

export function TransactionsMobileList({
  rows,
  error,
  refetch,
  table,
  stats,
  statusFilter,
  dispatch,
}: {
  rows: Transaction[];
  error: Error | null;
  refetch: () => void;
  table: TableState;
  stats: { total: number; revenue: number; avg: number; pending: number } | null;
  statusFilter: string;
  dispatch: AppDispatch;
}) {
  return (
    <div className="flex flex-col gap-4 pb-4 sm:hidden">
      <h1 className="text-foreground text-xl font-bold tracking-tight">
        Transactions Ledger
      </h1>
      <p className="text-muted-foreground -mt-3 text-sm">
        Monitor corporate financial ledger
      </p>

      {/* Mobile Toolbar */}
      <div className="flex items-center gap-2">
        <SearchInput
          label="Search transactions"
          placeholder="Search Transaction..."
          value={table.search}
          onChange={(value) =>
            dispatch(setSearch({ table: "transactions", search: value }))
          }
          className="flex-1"
        />
        <MobileFilterDrawer>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Date</span>
            <Select defaultValue="30">
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Type</span>
            <Select defaultValue="all">
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                dispatch(setFilter({ table: "transactions", key: "status", value }))
              }
            >
              <SelectTrigger className="h-11 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              className="h-11 w-full border-dashed"
              onClick={() => dispatch(resetFilters({ table: "transactions" }))}
            >
              Reset Filters
            </Button>
          </div>
        </MobileFilterDrawer>
      </div>

      {/* Mobile Stats */}
      <div className="grid grid-cols-2 gap-3">
        <MiniStatCard
          label="Total Txns"
          value={stats ? String(stats.total) : undefined}
        />
        <MiniStatCard
          label="Total Volume"
          value={stats ? formatCompactCurrency(stats.revenue) : undefined}
        />
        <MiniStatCard
          label="Avg. Amount"
          value={stats ? formatCurrency(stats.avg) : undefined}
        />
        <MiniStatCard
          label="Success Rate"
          value={stats ? "96.8%" : undefined}
          tone="text-success"
        />
      </div>

      {/* Mobile List */}
      <div className="flex flex-col gap-3">
        {error ? (
          <ErrorState title="Couldn't load transactions" onRetry={refetch} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={ArrowLeftRight}
            title="No transactions found"
            description="No transactions match your search or filters."
            actionLabel="Clear filters"
            onAction={() => dispatch(resetFilters({ table: "transactions" }))}
          />
        ) : (
          rows.map((row) => {
            const type = getTransactionType(row.cartId);
            const amount =
              type === "Refund" ? -row.discountedAmount : row.discountedAmount;
            let status = row.status as TransactionStatus;
            if (type === "Refund") status = "refunded" as TransactionStatus;

            return (
              <Link
                key={row.id}
                href={`/transactions/${row.id}`}
                className="block transition-transform active:scale-[0.98]"
              >
                <MobileCard
                  top={
                    <>
                      <span className="text-foreground text-sm font-bold">
                        #TXN-{1000 + row.cartId}
                      </span>
                      <TransactionStatusBadge status={status} />
                    </>
                  }
                  middle={
                    <>
                      <UserCell
                        firstName={row.customerFirstName}
                        lastName={row.customerLastName}
                        avatarUrl={row.customerAvatar}
                      />
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-sm font-bold tabular-nums ${type === "Refund" ? "text-danger" : "text-foreground"}`}
                        >
                          {type === "Refund" ? "-" : ""}
                          {formatCurrency(Math.abs(amount))}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${getTypeStyle(type)}`}
                        >
                          {type}
                        </span>
                      </div>
                    </>
                  }
                  bottom={
                    <>
                      <span className="text-muted-foreground text-[11px] font-medium">
                        {formatDateTime(row.date)}
                      </span>
                      <Eye className="text-muted-foreground size-4" aria-hidden="true" />
                    </>
                  }
                />
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
