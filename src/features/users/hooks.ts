"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { USER_STALE_TIME } from "./constants";
import { UsersApi, type GetUsersOptions } from "./api";

/**
 * Server-paginated users list.
 * Uses keepPreviousData so page changes don't flash an empty table.
 */
export function useUsersTable(options: GetUsersOptions) {
  const query = useQuery({
    queryKey: queryKeys.users.table(options),
    queryFn: ({ signal }) => UsersApi.getUsers({ ...options, signal }),
    staleTime: USER_STALE_TIME,
    placeholderData: keepPreviousData,
  });

  return {
    rows: query.data?.users ?? [],
    total: query.data?.total ?? 0,
    page: query.data?.safePage ?? options.page,
    mode: query.data?.mode ?? "server",
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: () => void query.refetch(),
  };
}

/** Full profile for the user detail page. */
export function useUser(id: number) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: ({ signal }) => UsersApi.getUser(id, signal),
    enabled: Number.isFinite(id) && id > 0,
  });
}

/** Lightweight directory of all users (for lookups / relations). */
export function useUserDirectory() {
  return useQuery({
    queryKey: queryKeys.users.directory(),
    queryFn: ({ signal }) => UsersApi.getDirectory(signal),
    staleTime: USER_STALE_TIME,
  });
}
