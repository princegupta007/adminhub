import Link from "next/link";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { UserCell } from "@/components/common/user-cell";
import { formatCurrency } from "@/lib/formatters";
import { APP_ROUTES } from "@/lib/constants";
import type { Booking } from "../types";

export function BookingDetailDesktop({
  booking,
  setComingSoonOpen,
}: {
  booking: Booking;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="hidden sm:block">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="text-muted-foreground flex items-center gap-2">
          <Link
            href={APP_ROUTES.BOOKINGS}
            className="hover:text-foreground transition-colors"
          >
            Bookings
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold">
            #BKG-{1000 + (booking.todoId || 0)}
          </span>
        </div>
      </div>

      <div className="bg-card mb-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border p-5">
        <div className="flex items-center gap-4">
          <div className="bg-brand-soft flex size-12 shrink-0 items-center justify-center rounded-full text-[#5b52df]">
            <CalendarDays className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-xl font-bold">
                Booking #BKG-{1000 + (booking.todoId || 0)}
              </h2>
              <BookingStatusBadge status={booking.status} />
              <span className="bg-brand-soft inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium text-[#5b52df]">
                Completed
              </span>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Virtual Consultation Room • Scheduled for{" "}
              {new Date(booking.date || "").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              at {booking.time.split(" ")[0]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white"
            onClick={() => setComingSoonOpen(true)}
          >
            <CalendarDays
              className="text-muted-foreground mr-2 size-4"
              aria-hidden="true"
            />
            Reschedule
          </Button>
          <Button
            variant="outline"
            className="border-danger/40 text-danger bg-danger-soft hover:bg-danger/20 hover:text-danger"
            onClick={() => setComingSoonOpen(true)}
          >
            Cancel Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="bg-card rounded-xl border">
            <div className="bg-card border-b px-5 py-4 text-base font-bold">
              Booking Meeting Logistics
            </div>
            <div className="flex flex-col gap-5 p-5 text-sm">
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Service Type</span>
                <span className="font-semibold">{booking.service}</span>
              </div>
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Scheduled Date</span>
                <span className="font-semibold">
                  {new Date(booking.date || "").toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Meeting Time Slot</span>
                <span className="font-semibold">
                  {booking.time} - {booking.time.replace("10:00 AM", "11:00 AM")} (EST)
                </span>
              </div>
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Meeting Location</span>
                <span className="font-semibold text-[#5b52df]">
                  Virtual - Zoom Link Provided
                </span>
              </div>
              <div className="flex flex-col gap-1.5 pb-2">
                <span className="text-muted-foreground">Client Special Notes</span>
                <span className="text-muted-foreground font-semibold italic">
                  &quot;Need assistance with expanding our payment gateway options and
                  preparing our database backup plans.&quot;
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border">
            <div className="bg-card border-b px-5 py-4 text-base font-bold">
              Customer Overview
            </div>
            <div className="flex items-center justify-between p-5 text-sm">
              <div className="flex items-center gap-4 text-left">
                <UserCell
                  firstName={booking.customerName.split(" ")[0] || ""}
                  lastName={booking.customerName.split(" ").slice(1).join(" ") || ""}
                  avatarUrl={`https://i.pravatar.cc/150?u=${booking.id}`}
                  subtitle={booking.customerEmail ?? "sarah.j@example.com"}
                />
              </div>
              <span className="text-muted-foreground font-semibold">
                12 Total Bookings Completed
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-card rounded-xl border">
            <div className="bg-card border-b px-5 py-4 text-base font-bold">
              Payment Ledger Breakdown
            </div>
            <div className="flex flex-col gap-5 p-5 text-sm">
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Billing Amount</span>
                <span className="font-bold">{formatCurrency(booking.price || 0)}</span>
              </div>
              <div className="border-border flex justify-between border-b pb-4">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="bg-success-soft text-success inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase">
                  Paid
                </span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-muted-foreground">Invoice Link</span>
                <span className="cursor-pointer font-semibold text-[#5b52df]">
                  #INV-10294
                </span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border">
            <div className="bg-card border-b px-5 py-4 text-base font-bold">
              Booking Lifecycle Logs
            </div>
            <div className="p-5">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-success-soft text-success flex size-4 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <div className="bg-border my-1 h-10 w-px" />
                </div>
                <div className="pb-4">
                  <p className="text-foreground text-sm font-semibold">
                    Confirmation Sent
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                    Outlook invite dispatched
                    <br />
                    Oct 12, 10:00
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-success-soft text-success flex size-4 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <div className="bg-border my-1 h-10 w-px" />
                </div>
                <div className="pb-4">
                  <p className="text-foreground text-sm font-semibold">
                    Status Set to Confirmed
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                    Consultant assigned automatically
                    <br />
                    Oct 12, 09:30
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-success-soft text-success flex size-4 shrink-0 items-center justify-center rounded-full">
                    <CheckCircle2 className="size-3" />
                  </div>
                </div>
                <div className="pb-2">
                  <p className="text-foreground text-sm font-semibold">Booking Created</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-snug">
                    Client self-service reservation
                    <br />
                    Oct 12, 09:28
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
