import type { RawTodo } from "@/types/api";
import type { UserSummary } from "@/features/users/types";
import {
  deriveBookingPrice,
  deriveBookingService,
  deriveBookingStatus,
  deriveBookingTime,
  deriveDateWithin,
} from "@/lib/derive";
import type { Booking } from "./types";

export function toBooking(
  todo: RawTodo,
  usersById: Map<
    number,
    Pick<UserSummary, "id" | "firstName" | "lastName" | "email" | "avatar">
  >,
): Booking {
  const user = usersById.get(todo.userId);
  const { service, category } = deriveBookingService(todo.id);
  const date = deriveDateWithin(todo.id, 60, 45);
  return {
    id: `BKG-${String(todo.id).padStart(4, "0")}`,
    todoId: todo.id,
    userId: todo.userId,
    customerFirstName: user?.firstName ?? "Customer",
    customerLastName: user?.lastName ?? `#${todo.userId}`,
    customerName: user
      ? `${user.firstName} ${user.lastName}`
      : `Customer #${todo.userId}`,
    customerAvatar: user?.avatar ?? null,
    customerEmail: user?.email ?? null,
    service,
    category,
    date,
    time: deriveBookingTime(todo.id),
    status: deriveBookingStatus(todo.id, todo.completed),
    price: deriveBookingPrice(todo.id),
  };
}

/** Booking revenue per user, used for cross-links on detail pages. */
export function toUserBookingSpend(
  bookings: Booking[],
): Map<number, { count: number; total: number }> {
  const spend = new Map<number, { count: number; total: number }>();
  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;
    const current = spend.get(booking.userId) ?? { count: 0, total: 0 };
    current.count += 1;
    current.total += booking.price;
    spend.set(booking.userId, current);
  }
  return spend;
}
