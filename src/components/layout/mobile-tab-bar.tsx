"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  CalendarCheck,
  CircleUserRound,
  LayoutDashboard,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { APP_ROUTES } from "@/lib/constants";

const TABS = [
  { label: "Dashboard", href: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, exact: true },
  { label: "Users", href: APP_ROUTES.USERS, icon: Users },
  { label: "Transactions", href: APP_ROUTES.TRANSACTIONS, icon: ArrowLeftRight },
  { label: "Bookings", href: APP_ROUTES.BOOKINGS, icon: CalendarCheck },
  { label: "Profile", href: APP_ROUTES.PROFILE, icon: CircleUserRound },
];

/**
 * Fixed bottom navigation shown below the lg breakpoint, matching the
 * mobile design: Dashboard / Users / Transactions / Bookings / Profile.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary mobile"
      className="border-border bg-card fixed inset-x-0 bottom-0 z-40 border-t lg:hidden"
    >
      <ul className="mx-auto grid max-w-md grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {TABS.map((tab) => {
          const active =
            tab.exact || tab.href === "/"
              ? pathname === "/"
              : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "focus-visible:ring-ring/50 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                  active ? "text-brand" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="text-[10px] leading-none font-medium">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
