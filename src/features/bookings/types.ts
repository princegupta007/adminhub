import type { BookingStatus } from "@/lib/derive";

export type { BookingStatus };

export interface Booking {
  id: string;
  todoId: number;
  userId: number;
  customerFirstName: string;
  customerLastName: string;
  customerName: string;
  customerAvatar: string | null;
  customerEmail: string | null;
  service: string;
  category: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
}
