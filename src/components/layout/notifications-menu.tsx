"use client";

import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarCheck,
  CreditCard,
  UserPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DemoNotification {
  id: string;
  icon: LucideIcon;
  tone: "brand" | "success" | "warning" | "danger" | "info";
  title: string;
  body: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: DemoNotification[] = [
  {
    id: "n1",
    icon: UserPlus,
    tone: "brand",
    title: "New user registered",
    body: "Aubrey Wagner created an account",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "n2",
    icon: CreditCard,
    tone: "warning",
    title: "Transaction pending review",
    body: "#TXN-1180 · $1,028.19 awaits approval",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    icon: CalendarCheck,
    tone: "success",
    title: "Booking confirmed",
    body: "Esther Howard — Home Cleaning",
    time: "3 hr ago",
    unread: true,
  },
  {
    id: "n4",
    icon: AlertTriangle,
    tone: "danger",
    title: "Server capacity at 92%",
    body: "Consider scaling resources",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n5",
    icon: Wrench,
    tone: "info",
    title: "Maintenance scheduled",
    body: "Oct 5 · 02:00–04:00 UTC",
    time: "Yesterday",
    unread: false,
  },
];

const TONES: Record<DemoNotification["tone"], string> = {
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
};

const UNREAD_COUNT = NOTIFICATIONS.filter((n) => n.unread).length;

/**
 * Notification bell with a demo inbox dropdown.
 */
export function NotificationsMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring/50 relative inline-flex size-9 items-center justify-center rounded-full transition-colors focus-visible:ring-[3px] focus-visible:outline-none"
        aria-label={`Notifications (${UNREAD_COUNT} unread)`}
      >
        <div className="relative">
          <Bell className="size-4.5" aria-hidden="true" />
          {UNREAD_COUNT > 0 ? (
            <div className="absolute -top-1.5 -right-1.5 flex size-4">
              <span className="bg-danger absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-danger ring-background relative inline-flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white ring-2">
                {UNREAD_COUNT}
              </span>
            </div>
          ) : null}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-foreground text-sm font-semibold">Notifications</p>
          <span className="bg-brand-soft text-brand rounded-full px-2 py-0.5 text-xs font-medium">
            {UNREAD_COUNT} new
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto p-1">
          {NOTIFICATIONS.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex items-start gap-3 rounded-lg px-3 py-2.5"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                  TONES[n.tone],
                )}
                aria-hidden="true"
              >
                <n.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-foreground truncate text-sm font-medium">
                    {n.title}
                  </span>
                  {n.unread ? (
                    <span
                      className="bg-brand size-1.5 shrink-0 rounded-full"
                      aria-label="Unread"
                    />
                  ) : null}
                </span>
                <span className="text-muted-foreground mt-0.5 block truncate text-xs">
                  {n.body}
                </span>
                <span className="text-muted-foreground/80 mt-1 block text-[11px]">
                  {n.time}
                </span>
              </span>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="border-t p-1">
          <DropdownMenuItem className="text-brand focus:text-brand justify-center text-sm font-medium">
            View all notifications
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
