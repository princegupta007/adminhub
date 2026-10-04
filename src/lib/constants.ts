/**
 * Global application constants.
 */

export const APP_CONSTANTS = {
  /** Default pagination size for main tables */
  TABLE_PAGE_SIZE: 8,
  /** Pagination size for smaller dashboard tables */
  DASHBOARD_PAGE_SIZE: 6,
} as const;

/**
 * Shared application routes to prevent typo risks and ensure consistency.
 */
export const APP_ROUTES = {
  DASHBOARD: "/",
  USERS: "/users",
  TRANSACTIONS: "/transactions",
  BOOKINGS: "/bookings",
  PROFILE: "/profile",
  LOGIN: "/login",
} as const;
