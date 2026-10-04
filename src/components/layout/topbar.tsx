"use client";

import { AvatarMenu } from "@/components/layout/avatar-menu";
import { BrandMark } from "@/components/layout/brand";
import { NotificationsMenu } from "@/components/layout/notifications-menu";

interface TopbarProps {
  title: string;
  subtitle?: string;
  /** Right-hand slot (search, actions). Desktop only. */
  children?: React.ReactNode;
}

/**
 * Sticky application topbar.
 * - Mobile (<lg): AdminHub brand mark, notifications and account menu —
 *   matching the mobile design (no sidebar, bottom tab navigation).
 * - Desktop (lg+): page title + subtitle with the global search.
 */
export function Topbar({ title, subtitle, children }: TopbarProps) {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 border-b backdrop-blur">
      {/* Mobile: brand bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:hidden">
        <BrandMark className="text-foreground" />
        <div className="flex items-center gap-3">
          <NotificationsMenu />
          <AvatarMenu />
        </div>
      </div>

      {/* Desktop: page title bar */}
      <div className="hidden min-h-[72px] flex-wrap items-center justify-between gap-3 px-8 py-3 lg:flex">
        <div className="min-w-0">
          <h1 className="text-foreground truncate text-lg font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-muted-foreground truncate text-sm">{subtitle}</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {children}
          <NotificationsMenu />
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}
