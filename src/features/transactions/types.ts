import type { TransactionStatus } from "@/lib/derive";

export type { TransactionStatus };

export interface TransactionItem {
  cartItemId: number;
  title: string;
  quantity: number;
  unitPrice: number;
  thumbnail: string;
  lineTotal: number;
}

export interface Transaction {
  id: string;
  cartId: number;
  userId: number;
  customerFirstName: string;
  customerLastName: string;
  customerName: string;
  customerAvatar: string | null;
  customerEmail: string | null;
  date: string;
  status: TransactionStatus;
  paymentMethod: string;
  itemCount: number;
  totalQuantity: number;
  amount: number;
  discountedAmount: number;
  items: TransactionItem[];
}
