import Link from "next/link";
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/formatters";
import { APP_ROUTES } from "@/lib/constants";
import type { Booking } from "../types";

export function BookingDetailMobile({
  booking,
  setComingSoonOpen,
}: {
  booking: Booking;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-4 pb-4 sm:hidden">
      <div className="-mx-2 flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-3">
          <Link href={APP_ROUTES.BOOKINGS} className="text-muted-foreground -ml-1 p-1">
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <h1 className="text-foreground text-lg font-bold">Booking Detail</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="text-muted-foreground size-8 rounded-full bg-white"
          onClick={() => setComingSoonOpen(true)}
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <div className="bg-card flex flex-col items-center rounded-xl border p-6 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Booking #BKG-{1000 + booking.todoId}
        </p>
        <h2 className="text-foreground mt-1 text-xl font-bold">{booking.service}</h2>
        <div className="mt-3 flex items-center gap-2">
          <BookingStatusBadge status={booking.status} />
          <span className="bg-brand-soft inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-[#5b52df]">
            Premium
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          className="h-12 flex-1 rounded-xl bg-[#5b52df] text-white hover:bg-[#5b52df]/90"
          onClick={() => setComingSoonOpen(true)}
        >
          Reschedule
        </Button>
        <Button
          variant="outline"
          className="border-danger/40 text-danger hover:bg-danger-soft hover:text-danger h-12 flex-1 rounded-xl"
          onClick={() => setComingSoonOpen(true)}
        >
          Cancel Booking
        </Button>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="bg-card border-b px-4 py-3 text-sm font-bold">
          Booking Details
        </div>
        <div className="flex flex-col gap-4 p-4 text-sm">
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold">{booking.service}</span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold">
              {new Date(booking.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Time</span>
            <span className="font-semibold">
              {booking.time} - {booking.time.replace("10:00 AM", "11:00 AM")}
            </span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-semibold">1 hour</span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Location</span>
            <span className="font-semibold">Virtual (Zoom link enclosed)</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground w-24 shrink-0">Customer Notes</span>
            <span className="text-right leading-tight font-semibold">
              Please prepare Q3 analytics document beforehand.
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="bg-card border-b px-4 py-3 text-sm font-bold">
          Customer Profile
        </div>
        <div className="flex flex-col gap-4 p-4 text-sm">
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Name</span>
            <span className="font-semibold">{booking.customerName}</span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Email</span>
            <span className="font-semibold">
              {booking.customerEmail || "sarah.j@example.com"}
            </span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Phone</span>
            <span className="font-semibold">+1 555-0123</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground">Previous Bookings</span>
            <span className="cursor-pointer font-semibold text-[#5b52df]">
              12 bookings completed
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="bg-card border-b px-4 py-3 text-sm font-bold">
          Payment Information
        </div>
        <div className="flex flex-col gap-4 p-4 text-sm">
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-bold">{formatCurrency(booking.price)}</span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Payment Status</span>
            <span className="text-success font-bold">Paid</span>
          </div>
          <div className="border-border flex justify-between border-b pb-3">
            <span className="text-muted-foreground">Method</span>
            <span className="font-semibold">Invoiced (Credit Card)</span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-muted-foreground">Invoice</span>
            <span className="cursor-pointer font-semibold text-[#5b52df]">
              #INV-20419
            </span>
          </div>
        </div>
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <div className="bg-card border-b px-4 py-3 text-sm font-bold">Booking Log</div>
        <div className="p-5">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 size-2.5 shrink-0 rounded-full bg-[#5c4dff]" />
              <div className="bg-border my-1 h-10 w-px" />
            </div>
            <div className="pb-3">
              <p className="text-foreground text-xs font-semibold">
                Automated Reminder Sent
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                SMS and Email dispatch verified.
                <br />
                Today, 09:00 AM
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-success mt-1 size-2.5 shrink-0 rounded-full" />
              <div className="bg-border my-1 h-10 w-px" />
            </div>
            <div className="pb-3">
              <p className="text-foreground text-xs font-semibold">Booking Confirmed</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                Consultant accepted session invitation.
                <br />
                Oct 1, 11:15 AM
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 size-2.5 shrink-0 rounded-full bg-[#5c4dff]" />
            </div>
            <div className="pb-1">
              <p className="text-foreground text-xs font-semibold">Booking Created</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                Checkout verified via #TXN-7823.
                <br />
                Oct 1, 10:33 AM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
