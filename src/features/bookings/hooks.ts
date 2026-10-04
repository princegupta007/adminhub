"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { BOOKING_STALE_TIME } from "./constants";
import { BookingsApi } from "./api";

/**
 * Fetch all bookings.
 * Cached to share data across the app.
 */
export function useBookings() {
  const query = useQuery({
    queryKey: queryKeys.bookings.all,
    queryFn: ({ signal }) => BookingsApi.getBookings(signal),
    staleTime: BOOKING_STALE_TIME,
  });

  return {
    bookings: query.data,
    isLoading: query.isLoading,
    isPending: query.isPending,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}
