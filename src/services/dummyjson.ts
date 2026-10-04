import { apiGet } from "./client";
import type { ApiListResponse, RawCart, RawTodo, RawUser } from "@/types/api";

export interface UserListParams {
  limit?: number;
  skip?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

/** Paginated users list — supports server-side search & sort. */
export async function fetchUsers(
  params: UserListParams = {},
  signal?: AbortSignal,
): Promise<ApiListResponse<RawUser> & { users: RawUser[] }> {
  return apiGet("/users", {
    params: {
      limit: params.limit,
      skip: params.skip,
      q: params.search,
      sortBy: params.sortBy,
      order: params.order,
    },
    signal,
  });
}

/** Single user by id (throws 404 ApiError when missing). */
export function fetchUser(id: number, signal?: AbortSignal): Promise<RawUser> {
  return apiGet(`/users/${id}`, { signal });
}

/**
 * Every user in one request (DummyJSON returns all rows for limit=0).
 * Used for customer lookups and dashboard aggregates — trimmed with
 * `select` to keep the payload small.
 */
export async function fetchUserDirectory(
  signal?: AbortSignal,
): Promise<{ users: RawUser[] }> {
  return apiGet("/users", {
    params: {
      limit: 0,
      select: "id,firstName,lastName,image,age,gender,email,phone",
    },
    signal,
  });
}

/** Every cart — the source for transactions and revenue aggregates. */
export async function fetchCarts(signal?: AbortSignal): Promise<{ carts: RawCart[] }> {
  return apiGet("/carts", { params: { limit: 0 }, signal });
}

/** Every todo — the source for bookings. */
export async function fetchTodos(signal?: AbortSignal): Promise<{ todos: RawTodo[] }> {
  return apiGet("/todos", { params: { limit: 0 }, signal });
}
