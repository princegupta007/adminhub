import { fetchCarts } from "@/services/dummyjson";
import { UsersApi } from "@/features/users/api";
import { toTransaction } from "./mappers";
import type { Transaction } from "./types";

export const TransactionsApi = {
  /**
   * Fetch all transactions.
   * In a real backend, this would be a single API call that joins transaction and user data.
   * For the mock implementation, we fetch carts and the user directory and join them here,
   * keeping the UI hook completely unaware of the mock data structure.
   */
  getTransactions: async (signal?: AbortSignal): Promise<Transaction[]> => {
    const [{ carts }, users] = await Promise.all([
      fetchCarts(signal),
      UsersApi.getDirectory(signal),
    ]);

    const usersById = new Map(users.map((user) => [user.id, user]));

    return carts
      .map((cart) => toTransaction(cart, usersById))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
};
