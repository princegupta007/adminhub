import { fetchTodos } from "@/services/dummyjson";
import { UsersApi } from "@/features/users/api";
import { toBooking } from "./mappers";
import type { Booking } from "./types";

export const BookingsApi = {
  /**
   * Fetch all bookings.
   * In a real backend, this would be a single API call that joins booking and user data.
   * For the mock implementation, we fetch todos and the user directory and join them here,
   * keeping the UI hook completely unaware of the mock data structure.
   */
  getBookings: async (signal?: AbortSignal): Promise<Booking[]> => {
    const [{ todos }, users] = await Promise.all([
      fetchTodos(signal),
      UsersApi.getDirectory(signal),
    ]);

    const usersById = new Map(users.map((user) => [user.id, user]));

    return todos
      .map((todo) => toBooking(todo, usersById))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
};
