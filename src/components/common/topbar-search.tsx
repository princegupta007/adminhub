"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { NAV_SECTIONS } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/lib/constants";

interface SearchEntry {
  label: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

/** Searchable entries mirror the sidebar navigation (plus Profile). */
function navigationEntries(): SearchEntry[] {
  const entries: SearchEntry[] = NAV_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      label: item.label,
      href: item.href,
      icon: item.icon,
      exact: item.exact,
      description:
        item.label === "Dashboard"
          ? "Overview, analytics & reports"
          : item.label === "Users"
            ? "Directory & user profiles"
            : item.label === "Transactions"
              ? "Orders & payment history"
              : "Service bookings & schedule",
    })),
  );
  entries.push({
    label: "Profile",
    href: APP_ROUTES.PROFILE,
    description: "Your account & preferences",
    icon: (props) => (
      <span
        className={cn(
          "bg-brand-soft text-brand flex size-4 items-center justify-center rounded-full text-[9px] font-bold",
          props.className,
        )}
        aria-hidden="true"
      >
        SJ
      </span>
    ),
  });
  return entries;
}

const ENTRIES = navigationEntries();

/**
 * Global topbar search — surfaces the sidebar navigation entries as
 * filterable, keyboard-navigable results. Ctrl/⌘+K focuses the field.
 */
export function TopbarSearch() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ENTRIES;
    return ENTRIES.filter((entry) => entry.label.toLowerCase().includes(q));
  }, [query]);

  // Close on outside click / focus loss.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Ctrl/⌘+K shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) =>
        results.length ? (i - 1 + results.length) % results.length : 0,
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      const entry = results[activeIndex];
      if (entry) go(entry.href);
    } else if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative hidden w-full max-w-xs sm:block"
      role="search"
    >
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden="true"
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search console…"
        aria-label="Search"
        role="combobox"
        aria-expanded={open}
        aria-controls="topbar-search-results"
        aria-activedescendant={
          open && results[activeIndex] ? `search-option-${activeIndex}` : undefined
        }
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="bg-card pr-12 pl-9"
      />
      <kbd className="bg-muted text-muted-foreground pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border px-1.5 py-0.5 text-[10px] font-medium md:block">
        ⌘K
      </kbd>

      {open ? (
        <div
          id="topbar-search-results"
          role="listbox"
          aria-label="Search results"
          className="bg-popover text-popover-foreground absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-xl border shadow-lg"
        >
          <p className="text-muted-foreground border-b px-3 py-2 text-[11px] font-semibold tracking-wide uppercase">
            {query.trim() ? "Results" : "Quick navigation"}
          </p>
          {results.length === 0 ? (
            <p className="text-muted-foreground px-3 py-6 text-center text-sm">
              No matches for “{query.trim()}”
            </p>
          ) : (
            <ul className="p-1">
              {results.map((entry, index) => (
                <li key={entry.href} role="option" aria-selected={index === activeIndex}>
                  <Link
                    id={`search-option-${index}`}
                    href={entry.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "focus-visible:ring-ring/50 flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors focus-visible:ring-[3px] focus-visible:outline-none",
                      index === activeIndex
                        ? "bg-muted text-foreground"
                        : "text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg",
                        index === activeIndex
                          ? "bg-brand-soft text-brand"
                          : "bg-muted text-muted-foreground",
                      )}
                      aria-hidden="true"
                    >
                      <entry.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{entry.label}</span>
                      <span className="text-muted-foreground block truncate text-xs">
                        {entry.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <p className="text-muted-foreground border-t px-3 py-2 text-[11px]">
            ↑↓ to navigate · ↵ to open · esc to dismiss
          </p>
        </div>
      ) : null}
    </div>
  );
}
