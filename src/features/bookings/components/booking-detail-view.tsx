"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/common/error-state";
import { useTodayLabel } from "@/lib/use-now";
import { useBookings } from "../hooks";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { TopbarSearch } from "@/components/common/topbar-search";
import { BookingDetailDesktop } from "./booking-detail-desktop";
import { BookingDetailMobile } from "./booking-detail-mobile";

export function BookingDetailView({ id }: { id: string }) {
  const { bookings, error, refetch } = useBookings();
  const booking = bookings?.find((item) => item.id === id);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const todayLabel = useTodayLabel();

  if (error) {
    return (
      <AppShell title="Booking Details">
        <ErrorState onRetry={refetch} />
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Booking Management"
      subtitle={todayLabel ?? undefined}
      mobileHeading={false}
      topbarActions={<TopbarSearch />}
    >
      {booking && (
        <>
          <BookingDetailDesktop booking={booking} setComingSoonOpen={setComingSoonOpen} />
          <BookingDetailMobile booking={booking} setComingSoonOpen={setComingSoonOpen} />
        </>
      )}

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}
