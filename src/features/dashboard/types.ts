import type { TransactionStatus } from "@/features/transactions/types";
import type { Transaction } from "@/features/transactions/types";
import type { Booking } from "@/features/bookings/types";
import type { BookingStatus } from "@/features/bookings/types";
import type { UserSummary } from "@/features/users/types";

export interface KpiStat {
  id: string;
  label: string;
  value: number;
  format: "currency" | "fullCurrency" | "number" | "percent";
  changePct: number | null;
  trend: "up" | "down" | "flat";
  hint: string;
}

export interface RevenuePoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface StatusSlice {
  status: TransactionStatus | BookingStatus;
  label: string;
  count: number;
  amount: number;
}

export interface CategoryPoint {
  category: string;
  bookings: number;
  revenue: number;
}

export interface TopProduct {
  title: string;
  thumbnail: string;
  unitsSold: number;
  revenue: number;
}

export interface DashboardStats {
  kpis: KpiStat[];
  revenueByMonth: RevenuePoint[];
  ordersByStatus: StatusSlice[];
  bookingsByStatus: StatusSlice[];
  bookingsByCategory: CategoryPoint[];
  topProducts: TopProduct[];
  recentTransactions: Transaction[];
  upcomingBookings: Booking[];
  newCustomers: UserSummary[];
  totals: {
    revenue: number;
    pendingRevenue: number;
    orders: number;
    paidOrders: number;
    pendingOrders: number;
    failedOrders: number;
    users: number;
    bookings: number;
    confirmedBookings: number;
    completedBookings: number;
    averageOrderValue: number;
    bookingSuccessRate: number;
  };
}
