import { ArrowLeftRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/data-table";
import type { DataTableColumn } from "@/components/common/data-table";
import { DataTableLayout } from "@/components/common/data-table-layout";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { SearchInput } from "@/components/common/search-input";
import { Pagination } from "@/components/common/pagination";
import { MiniStatCard } from "@/components/common/mini-stat-card";
import {
  resetFilters,
  setFilter,
  setPage,
  setSearch,
  toggleSort,
} from "@/store/tables-slice";
import { formatCompactCurrency, formatCurrency } from "@/lib/formatters";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";
import type { Transaction } from "../types";
import { APP_CONSTANTS } from "@/lib/constants";

export function TransactionsDesktopView({
  rows,
  sortedLength,
  page,
  isPending,
  error,
  refetch,
  table,
  columns,
  stats,
  statusFilter,
  dispatch,
  setComingSoonOpen,
}: {
  rows: Transaction[];
  sortedLength: number;
  page: number;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  table: TableState;
  columns: DataTableColumn<Transaction>[];
  stats: { total: number; revenue: number; avg: number; pending: number } | null;
  statusFilter: string;
  dispatch: AppDispatch;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="hidden h-[calc(100vh-140px)] flex-col gap-4 sm:flex">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            Transaction History
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor and manage all corporate financial transactions
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white"
          onClick={() => setComingSoonOpen(true)}
        >
          <Download className="mr-2 size-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStatCard
          label="Total Transactions"
          value={stats ? String(stats.total) : undefined}
        />
        <MiniStatCard
          label="Total Volume"
          value={stats ? formatCompactCurrency(stats.revenue) : undefined}
        />
        <MiniStatCard
          label="Avg. Transaction"
          value={stats ? formatCurrency(stats.avg) : undefined}
        />
        <MiniStatCard
          label="Success Rate"
          value={stats ? "96.8%" : undefined}
          tone="text-success"
          chart={true}
        />
      </div>

      <DataTableLayout
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <SearchInput
              label="Search transactions"
              placeholder="Search ID or User..."
              value={table.search}
              onChange={(value) =>
                dispatch(setSearch({ table: "transactions", search: value }))
              }
              className="lg:w-[320px]"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Select defaultValue="30">
                <SelectTrigger size="sm" className="bg-card w-[170px]">
                  <span className="text-muted-foreground">Date:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger size="sm" className="bg-card w-[150px]">
                  <span className="text-muted-foreground">Type:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  dispatch(setFilter({ table: "transactions", key: "status", value }))
                }
              >
                <SelectTrigger size="sm" className="bg-card w-[140px]">
                  <span className="text-muted-foreground">Status:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="paid">High</SelectItem>
                  <SelectItem value="pending">Medium</SelectItem>
                  <SelectItem value="failed">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        }
        overlay={
          error ? (
            <ErrorState title="Couldn't load transactions" onRetry={refetch} />
          ) : null
        }
        table={
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            getRowHref={(row) => `/transactions/${row.id}`}
            sortBy={table.sortBy}
            sortDirection={table.sortDirection}
            onSort={(columnId) =>
              dispatch(toggleSort({ table: "transactions", column: columnId }))
            }
            loading={isPending}
            empty={
              <EmptyState
                icon={ArrowLeftRight}
                title="No transactions found"
                description="No transactions match your search or filters."
                actionLabel="Clear filters"
                onAction={() => dispatch(resetFilters({ table: "transactions" }))}
              />
            }
            caption="Transactions"
          />
        }
        pagination={
          !error && !isPending && sortedLength > 0 ? (
            <Pagination
              page={page}
              pageSize={APP_CONSTANTS.TABLE_PAGE_SIZE}
              total={sortedLength}
              itemLabel="results"
              onPageChange={(next) =>
                dispatch(setPage({ table: "transactions", page: next }))
              }
            />
          ) : null
        }
      />
    </div>
  );
}
