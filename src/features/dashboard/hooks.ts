"use client";

import { useMemo } from "react";
import { useUserDirectory } from "@/features/users/hooks";
import { useTransactions } from "@/features/transactions/hooks";
import { useBookings } from "@/features/bookings/hooks";
import { buildDashboardStats } from "./stats";

/**
 * Composes the shared resource hooks and computes all dashboard
 * aggregates client-side. Server data stays in TanStack Query — this hook
 * only derives view models from it.
 */
export function useDashboardStats() {
  const {
    transactions,
    isPending: txPending,
    error: txError,
    refetch: txRefetch,
  } = useTransactions();
  const {
    bookings,
    isPending: bPending,
    error: bError,
    refetch: bRefetch,
  } = useBookings();
  const {
    data: users,
    isPending: usersPending,
    error: usersError,
    refetch: usersRefetch,
  } = useUserDirectory();

  const isPending = txPending || bPending || usersPending;
  const error = txError ?? bError ?? usersError;
  const refetch = () => {
    void txRefetch();
    void bRefetch();
    void usersRefetch();
  };

  const stats = useMemo(
    () =>
      transactions && bookings && users
        ? buildDashboardStats(transactions, bookings, users)
        : undefined,
    [transactions, bookings, users],
  );

  return { stats, isPending, error, refetch };
}
