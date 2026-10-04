"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_SECTIONS } from "./nav-items";
import { BrandMark } from "@/components/layout/brand";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const SIDEBAR_WIDTH = "w-60";

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4"
    >
      {NAV_SECTIONS.map((section) => (
        <div key={section.title ?? "main"}>
          {section.title ? (
            <p className="text-sidebar-foreground/60 px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase">
              {section.title}
            </p>
          ) : null}
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "focus-visible:ring-ring/50 flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <Icon className="size-[18px] shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function SidebarBrand() {
  return (
    <div className="px-5 pt-5 pb-2">
      <BrandMark className="text-white" />
    </div>
  );
}

export function SidebarUser() {
  return (
    <div className="border-t border-white/10 px-4 py-4">
      <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
        <Avatar className="size-9 border border-white/20">
          <AvatarFallback className="bg-primary/80 text-xs font-semibold text-white">
            SJ
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">Sarah Jenkins</p>
          <p className="text-sidebar-foreground truncate text-xs">Super Admin</p>
        </div>
      </div>
    </div>
  );
}

/** Fixed desktop sidebar. */
export function Sidebar() {
  return (
    <aside
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex",
        SIDEBAR_WIDTH,
      )}
    >
      <SidebarBrand />
      <SidebarNav />
      <SidebarUser />
    </aside>
  );
}
