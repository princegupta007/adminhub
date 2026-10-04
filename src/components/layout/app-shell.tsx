"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  /** Right-side topbar slot (search etc.). Desktop only. */
  topbarActions?: React.ReactNode;
  /**
   * Render the page heading inside the content area on mobile (default
   * true). Pages that ship their own header block disable it.
   */
  mobileHeading?: boolean;
  children: React.ReactNode;
}

/**
 * Application chrome: fixed desktop sidebar (lg+), sticky topbar, and a
 * bottom tab bar on mobile — mirroring the responsive Figma designs.
 * On mobile the page heading renders inside the content area.
 */
export function AppShell({
  title,
  subtitle,
  topbarActions,
  mobileHeading = true,
  children,
}: AppShellProps) {
  return (
    <div className="min-h-svh">
      <Sidebar />

      <div className="lg:pl-60">
        <Topbar title={title} subtitle={subtitle}>
          {topbarActions}
        </Topbar>
        <main className="px-4 pt-4 pb-24 sm:px-6 lg:px-8 lg:pt-6 lg:pb-10">
          <div className="mx-auto w-full max-w-[1440px]">
            {/* Mobile page heading (desktop shows it in the topbar) */}
            <div className={mobileHeading ? "mb-4 lg:hidden" : "hidden"}>
              <h1 className="text-foreground text-xl font-semibold tracking-tight">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-muted-foreground mt-0.5 text-sm">{subtitle}</p>
              ) : null}
            </div>
            {children}
          </div>
        </main>
      </div>

      <MobileTabBar />
    </div>
  );
}
