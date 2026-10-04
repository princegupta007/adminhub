import { fetchUsers, fetchUser, fetchUserDirectory } from "@/services/dummyjson";
import { toUserSummary, toUserDetails } from "./mappers";
import type { UserSortField } from "./types";

const API_SORT_FIELDS: Partial<Record<UserSortField, string>> = {
  name: "firstName",
  email: "email",
};

export interface GetUsersOptions {
  page: number;
  pageSize: number;
  search?: string;
  role?: string;
  status?: string;
  sortField?: UserSortField;
  sortDirection?: "asc" | "desc";
  signal?: AbortSignal;
}

export const UsersApi = {
  /**
   * Fetch a paginated list of users, with optional search, filters, and sorting.
   * This simulates a real backend by handling mock-specific logic (like client-side
   * filtering for derived fields) entirely within the API layer.
   */
  getUsers: async (options: GetUsersOptions) => {
    const {
      page,
      pageSize,
      search = "",
      role = "all",
      status = "all",
      sortField,
      sortDirection = "asc",
      signal,
    } = options;

    const apiSort = sortField ? API_SORT_FIELDS[sortField] : undefined;
    const clientMode =
      role !== "all" || status !== "all" || (sortField && apiSort === undefined);

    if (clientMode) {
      // Simulate backend filtering/sorting for derived fields using the full directory
      const { users: rawUsers } = await fetchUserDirectory(signal);
      const directory = rawUsers.map(toUserSummary);

      const needle = search.trim().toLowerCase();
      const filtered = directory.filter((user) => {
        if (role !== "all" && user.role.toLowerCase() !== role.toLowerCase()) {
          return false;
        }
        if (status !== "all" && user.status !== status) return false;
        if (needle) {
          const haystack =
            `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase();
          if (!haystack.includes(needle)) return false;
        }
        return true;
      });

      const direction = sortDirection === "asc" ? 1 : -1;
      const sorted = [...filtered].sort((a, b) => {
        switch (sortField) {
          case "email":
            return a.email.localeCompare(b.email) * direction;
          case "joinDate":
            return (
              (new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()) *
              direction
            );
          case "lastActive":
            return (
              (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime()) *
              direction
            );
          case "status":
            return a.status.localeCompare(b.status) * direction;
          case "role":
            return a.role.localeCompare(b.role) * direction;
          default:
            return (
              `${a.firstName} ${a.lastName}`.localeCompare(
                `${b.firstName} ${b.lastName}`,
              ) * direction
            );
        }
      });

      const safePage = Math.max(
        1,
        Math.min(page, Math.ceil(sorted.length / pageSize) || 1),
      );

      return {
        users: sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
        total: sorted.length,
        safePage,
        mode: "client" as const,
      };
    } else {
      // Use native API pagination/sorting
      const data = await fetchUsers(
        {
          limit: pageSize,
          skip: (page - 1) * pageSize,
          search: search.trim() || undefined,
          sortBy: apiSort,
          order: sortDirection,
        },
        signal,
      );

      return {
        users: data.users.map(toUserSummary),
        total: data.total,
        safePage: page,
        mode: "server" as const,
      };
    }
  },

  /** Fetch full profile details for a specific user. */
  getUser: async (id: number, signal?: AbortSignal) => {
    const raw = await fetchUser(id, signal);
    return toUserDetails(raw);
  },

  /** Lightweight directory of all users (for lookups / relations). */
  getDirectory: async (signal?: AbortSignal) => {
    const { users } = await fetchUserDirectory(signal);
    return users.map(toUserSummary);
  },
};
