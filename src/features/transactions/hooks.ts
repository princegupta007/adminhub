"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { TRANSACTION_STALE_TIME } from "./constants";
import { TransactionsApi } from "./api";

/**
 * Fetch all transactions.
 * Cached to share data between the dashboard and the transactions page.
 */
export function useTransactions() {
  const query = useQuery({
    queryKey: queryKeys.transactions.all,
    queryFn: ({ signal }) => TransactionsApi.getTransactions(signal),
    staleTime: TRANSACTION_STALE_TIME,
  });

  return {
    transactions: query.data,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
