import type { GetUsersOptions } from "@/features/users/api";

/**
 * Central place for all TanStack Query keys, so invalidation and
 * cache-sharing stay predictable.
 */
export const queryKeys = {
  users: {
    all: ["users"] as const,
    table: (params: GetUsersOptions) =>
      [...queryKeys.users.all, "table", params] as const,
    detail: (id: number) => [...queryKeys.users.all, "detail", id] as const,
    directory: () => [...queryKeys.users.all, "directory"] as const,
  },
  transactions: {
    all: ["transactions"] as const,
  },
  bookings: {
    all: ["bookings"] as const,
  },
} as const;
