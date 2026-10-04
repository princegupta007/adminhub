import {
  CalendarCheck,
  CalendarClock,
  CircleCheck,
  Plus,
  Download,
  CalendarX2,
} from "lucide-react";
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
import { StatCard } from "@/components/common/stat-card";
import {
  resetFilters,
  setFilter,
  setPage,
  setSearch,
  toggleSort,
} from "@/store/tables-slice";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";
import { APP_CONSTANTS } from "@/lib/constants";
import type { Booking } from "../types";

export function BookingsDesktopView({
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
  rows: Booking[];
  sortedLength: number;
  page: number;
  isPending: boolean;
  error: Error | null;
  refetch: () => void;
  table: TableState;
  columns: DataTableColumn<Booking>[];
  stats: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    cancelled: number;
    value: number;
  } | null;
  statusFilter: string;
  dispatch: AppDispatch;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="hidden h-[calc(100vh-140px)] flex-col gap-4 sm:flex">
      <div className="flex shrink-0 flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-foreground text-2xl font-bold tracking-tight">
            Bookings Directory
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage all service bookings and consultation meetings
          </p>
        </div>
        <Button
          className="bg-[#5b52df] text-white hover:bg-[#5b52df]/90"
          onClick={() => setComingSoonOpen(true)}
        >
          <Plus className="mr-2 size-4" />
          New Booking
        </Button>
      </div>

      <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={stats ? stats.total : 0}
          format="number"
          changePct={8.4}
          icon={CalendarCheck}
        />
        <StatCard
          label="Active Bookings"
          value={stats ? stats.active : 0}
          format="number"
          changePct={3.1}
          icon={CalendarClock}
        />
        <StatCard
          label="Completed Bookings"
          value={stats ? stats.completed : 0}
          format="number"
          changePct={12.1}
          icon={CircleCheck}
        />
        <StatCard
          label="Cancelled Bookings"
          value={stats ? stats.cancelled : 0}
          format="number"
          changePct={1.4}
          icon={CalendarX2}
        />
      </div>

      <DataTableLayout
        toolbar={
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <SearchInput
                label="Search bookings"
                placeholder="Search bookings by ID or client..."
                value={table.search}
                onChange={(value) =>
                  dispatch(setSearch({ table: "bookings", search: value }))
                }
                className="w-[280px]"
              />
              <Select defaultValue="30">
                <SelectTrigger size="sm" className="bg-card w-[180px]">
                  <span className="text-muted-foreground">Date Range:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  dispatch(setFilter({ table: "bookings", key: "status", value }))
                }
              >
                <SelectTrigger size="sm" className="bg-card w-[130px]">
                  <span className="text-muted-foreground">Status:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger size="sm" className="bg-card w-[180px]">
                  <span className="text-muted-foreground">Service Type:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="support">Technical Support</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => setComingSoonOpen(true)}
            >
              <Download className="mr-2 size-4" aria-hidden="true" />
              Export List
            </Button>
          </div>
        }
        overlay={
          error ? <ErrorState title="Couldn't load bookings" onRetry={refetch} /> : null
        }
        table={
          <DataTable
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            getRowHref={(row) => `/bookings/${row.id}`}
            sortBy={table.sortBy}
            sortDirection={table.sortDirection}
            onSort={(columnId) =>
              dispatch(toggleSort({ table: "bookings", column: columnId }))
            }
            loading={isPending}
            empty={
              <EmptyState
                icon={CalendarCheck}
                title="No bookings found"
                description="No bookings match your search or filters."
                actionLabel="Clear filters"
                onAction={() => dispatch(resetFilters({ table: "bookings" }))}
              />
            }
            caption="Bookings"
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
                dispatch(setPage({ table: "bookings", page: next }))
              }
            />
          ) : null
        }
      />
    </div>
  );
}
