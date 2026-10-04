import Link from "next/link";
import { Pencil, Plus, CalendarCheck } from "lucide-react";
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
import { BookingStatusBadge } from "@/components/common/status-badge";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { resetFilters, setFilter, setSearch } from "@/store/tables-slice";
import { formatCurrency } from "@/lib/formatters";
import type { TableState } from "@/store/tables-slice";
import type { AppDispatch } from "@/store";
import type { Booking, BookingStatus } from "../types";

export function BookingsMobileList({
  rows,
  error,
  refetch,
  table,
  stats,
  statusFilter,
  dispatch,
  setComingSoonOpen,
}: {
  rows: Booking[];
  error: Error | null;
  refetch: () => void;
  table: TableState;
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
    <div className="flex flex-col gap-4 pb-4 sm:hidden">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Active Bookings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage and schedule corporate bookings
        </p>
      </div>

      <div className="flex items-center gap-2">
        <SearchInput
          label="Search bookings"
          placeholder="Search bookings..."
          value={table.search}
          onChange={(value) => dispatch(setSearch({ table: "bookings", search: value }))}
          className="flex-1 bg-white"
        />
        <MobileFilterDrawer>
          <div className="flex flex-col gap-2">
            <span className="text-foreground text-sm font-medium">Status</span>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                dispatch(setFilter({ table: "bookings", key: "status", value }))
              }
            >
              <SelectTrigger className="bg-card h-11 w-full">
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
          </div>
          <div className="pt-2">
            <Button
              variant="outline"
              className="h-11 w-full border-dashed"
              onClick={() => dispatch(resetFilters({ table: "bookings" }))}
            >
              Reset Filters
            </Button>
          </div>
        </MobileFilterDrawer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MiniStatCard
          label="Total Bookings"
          value={stats ? stats.total : undefined}
          className="min-h-0 p-3"
        />
        <MiniStatCard
          label="Active Sessions"
          value={stats ? stats.active : undefined}
          tone="text-[#5b52df]"
          className="min-h-0 p-3"
        />
        <MiniStatCard
          label="Completed"
          value={stats ? stats.completed : undefined}
          tone="text-success"
          className="min-h-0 p-3"
        />
        <MiniStatCard
          label="Cancelled"
          value={stats ? stats.cancelled : undefined}
          tone="text-danger"
          className="min-h-0 p-3"
        />
      </div>

      <Button
        className="w-full bg-[#5b52df] text-white hover:bg-[#5b52df]/90"
        onClick={() => setComingSoonOpen(true)}
      >
        <Plus className="mr-2 size-4" />
        Create New Booking
      </Button>

      <div className="flex flex-col gap-3">
        {error ? (
          <ErrorState title="Couldn't load bookings" onRetry={refetch} />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={CalendarCheck}
            title="No bookings found"
            description="No bookings match your search or filters."
            actionLabel="Clear filters"
            onAction={() => dispatch(resetFilters({ table: "bookings" }))}
          />
        ) : (
          rows.map((row) => (
            <Link
              key={row.id}
              href={`/bookings/${row.id}`}
              className="block transition-transform active:scale-[0.98]"
            >
              <MobileCard
                top={
                  <>
                    <span className="text-foreground text-sm font-bold">
                      #BKG-{1000 + row.todoId}
                    </span>
                    <BookingStatusBadge status={row.status as BookingStatus} />
                  </>
                }
                middle={
                  <>
                    <UserCell
                      firstName={row.customerName.split(" ")[0]}
                      lastName={row.customerName.split(" ").slice(1).join(" ")}
                      avatarUrl={`https://i.pravatar.cc/150?u=${row.id}`}
                      subtitle={row.service}
                    />
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-[#5b52df] tabular-nums">
                        {formatCurrency(row.price)}
                      </span>
                    </div>
                  </>
                }
                bottom={
                  <>
                    <span className="text-muted-foreground text-[11px] font-medium">
                      {new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      {row.time}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-muted size-6 shrink-0"
                      onClick={(e) => {
                        e.preventDefault();
                        setComingSoonOpen(true);
                      }}
                      aria-label="Edit booking"
                    >
                      <Pencil className="size-3" aria-hidden="true" />
                    </Button>
                  </>
                }
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
