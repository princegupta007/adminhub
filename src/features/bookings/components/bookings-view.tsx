"use client";

import { useNow, useTodayLabel } from "@/lib/use-now";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TopbarSearch } from "@/components/common/topbar-search";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { useTableState, useAppDispatch } from "@/store/hooks";
import { useBookings } from "../hooks";
import { useBookingColumns } from "./booking-columns";
import { BookingsDesktopView } from "./bookings-desktop-view";
import { BookingsMobileList } from "./bookings-mobile-list";

import { APP_CONSTANTS } from "@/lib/constants";

export function BookingsView() {
  const dispatch = useAppDispatch();
  const table = useTableState("bookings");
  const columns = useBookingColumns();
  const { bookings, isPending, error, refetch } = useBookings();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const statusFilter = table.filters.status ?? "all";

  const filtered = useMemo(() => {
    if (!bookings) return [];
    const needle = table.search.trim().toLowerCase();
    return bookings.filter((booking) => {
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }
      if (!needle) return true;
      const haystack =
        `${booking.id} ${booking.customerName} ${booking.service} ${booking.category}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [bookings, table.search, statusFilter]);

  const sorted = useMemo(() => {
    const direction = table.sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (table.sortBy) {
        case "customer":
          return a.customerName.localeCompare(b.customerName) * direction;
        case "service":
          return a.service.localeCompare(b.service) * direction;
        case "price":
          return (a.price - b.price) * direction;
        case "status":
          return a.status.localeCompare(b.status) * direction;
        case "date":
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
        case "id":
        default:
          return (a.todoId - b.todoId) * direction;
      }
    });
  }, [filtered, table.sortBy, table.sortDirection]);

  const todayLabel = useTodayLabel();
  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / APP_CONSTANTS.TABLE_PAGE_SIZE),
  );
  const page = Math.min(table.page, totalPages);
  const rows = sorted.slice(
    (page - 1) * APP_CONSTANTS.TABLE_PAGE_SIZE,
    page * APP_CONSTANTS.TABLE_PAGE_SIZE,
  );

  const now = useNow();
  const stats = useMemo(() => {
    if (!bookings) return null;
    const active = bookings.filter(
      (b) => b.status === "confirmed" || b.status === "pending",
    );
    const completed = bookings.filter((b) => b.status === "completed");
    const cancelled = bookings.filter((b) => b.status === "cancelled");
    const upcoming = bookings.filter(
      (b) => new Date(b.date).getTime() >= (now ?? 0) && b.status !== "cancelled",
    );
    return {
      total: bookings.length,
      active: active.length,
      upcoming: upcoming.length,
      completed: completed.length,
      cancelled: cancelled.length,
      value: active.reduce((sum, b) => sum + b.price, 0),
    };
  }, [bookings, now]);

  return (
    <AppShell
      title="Bookings"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
      mobileHeading={false}
    >
      <BookingsDesktopView
        rows={rows}
        sortedLength={sorted.length}
        page={page}
        isPending={isPending}
        error={error}
        refetch={refetch}
        table={table}
        columns={columns}
        stats={stats}
        statusFilter={statusFilter}
        dispatch={dispatch}
        setComingSoonOpen={setComingSoonOpen}
      />

      <BookingsMobileList
        rows={rows}
        error={error}
        refetch={refetch}
        table={table}
        stats={stats}
        statusFilter={statusFilter}
        dispatch={dispatch}
        setComingSoonOpen={setComingSoonOpen}
      />

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}
