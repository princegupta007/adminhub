import type { RawCart } from "@/types/api";
import type { UserSummary } from "@/features/users/types";
import {
  deriveDateWithin,
  derivePaymentMethod,
  deriveTransactionStatus,
} from "@/lib/derive";
import type { Transaction, TransactionItem } from "./types";

function toTransactionItems(cart: RawCart): TransactionItem[] {
  return cart.products.map((product) => ({
    cartItemId: product.id,
    title: product.title,
    quantity: product.quantity,
    unitPrice: product.price,
    thumbnail: product.thumbnail,
    lineTotal: product.total,
  }));
}

export function toTransaction(
  cart: RawCart,
  usersById: Map<
    number,
    Pick<UserSummary, "id" | "firstName" | "lastName" | "email" | "avatar">
  >,
): Transaction {
  const user = usersById.get(cart.userId);
  return {
    // Design uses #TXN-1082 style ids; keep the same numbering scheme.
    id: `TXN-${1000 + cart.id}`,
    cartId: cart.id,
    userId: cart.userId,
    customerFirstName: user?.firstName ?? "Customer",
    customerLastName: user?.lastName ?? `#${cart.userId}`,
    customerName: user
      ? `${user.firstName} ${user.lastName}`
      : `Customer #${cart.userId}`,
    customerAvatar: user?.avatar ?? null,
    customerEmail: user?.email ?? null,
    date: deriveDateWithin(cart.id, 330, 1),
    status: deriveTransactionStatus(cart.id),
    paymentMethod: derivePaymentMethod(cart.id),
    itemCount: cart.totalProducts,
    totalQuantity: cart.totalQuantity,
    amount: cart.total,
    discountedAmount: cart.discountedTotal,
    items: toTransactionItems(cart),
  };
}
