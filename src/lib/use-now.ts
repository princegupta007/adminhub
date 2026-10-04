"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

let cachedNow: number | null = null;
function getNowSnapshot(): number {
  if (cachedNow == null) cachedNow = Date.now();
  return cachedNow;
}

let cachedTodayLabel: string | null = null;
function getTodayLabelSnapshot(): string {
  if (cachedTodayLabel == null) {
    cachedTodayLabel = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }
  return cachedTodayLabel;
}

/**
 * Current timestamp, but only after hydration (null during SSR/first
 * render). Keeps render pure and avoids server/client mismatches.
 */
export function useNow(): number | null {
  return useSyncExternalStore(noopSubscribe, getNowSnapshot, () => null);
}

/** Formatted "Tuesday, October 1, 2024" label; null until hydrated. */
export function useTodayLabel(): string | null {
  return useSyncExternalStore(noopSubscribe, getTodayLabelSnapshot, () => null);
}
