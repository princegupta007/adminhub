import type { Booking } from "@/features/bookings/types";
import type { Transaction } from "@/features/transactions/types";
import type { UserSummary } from "@/features/users/types";
import type {
  CategoryPoint,
  DashboardStats,
  KpiStat,
  RevenuePoint,
  StatusSlice,
  TopProduct,
} from "./types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return ((current - previous) / previous) * 100;
}

function toTrend(changePct: number | null): "up" | "down" | "flat" {
  if (changePct === null || Math.abs(changePct) < 0.05) return "flat";
  return changePct > 0 ? "up" : "down";
}

function buildKpis(
  transactions: Transaction[],
  bookings: Booking[],
  users: UserSummary[],
): KpiStat[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const inWindow = (t: Transaction, from: number, to: number) => {
    const time = new Date(t.date).getTime();
    return time >= from && time < to;
  };

  const currentWindow = [now - 30 * dayMs, now];
  const previousWindow = [now - 60 * dayMs, now - 30 * dayMs];

  const revenueIn = (from: number, to: number) =>
    transactions
      .filter((t) => t.status === "paid" && inWindow(t, from, to))
      .reduce((sum, t) => sum + t.discountedAmount, 0);

  const bookingsIn = (from: number, to: number) =>
    bookings.filter((b) => {
      const time = new Date(b.date).getTime();
      return time >= from && time < to;
    }).length;

  const revenueChange = percentChange(
    revenueIn(currentWindow[0], currentWindow[1]),
    revenueIn(previousWindow[0], previousWindow[1]),
  );
  const bookingsChange = percentChange(
    bookingsIn(currentWindow[0], currentWindow[1]),
    bookingsIn(previousWindow[0], previousWindow[1]),
  );

  const pendingIn = (from: number, to: number) =>
    transactions.filter((t) => t.status === "pending" && inWindow(t, from, to)).length;
  const pendingChange = percentChange(
    pendingIn(currentWindow[0], currentWindow[1]),
    pendingIn(previousWindow[0], previousWindow[1]),
  );

  const usersJoinedIn = (from: number, to: number) =>
    users.filter((u) => {
      const time = new Date(u.joinDate).getTime();
      return time >= from && time < to;
    }).length;
  const usersChange = percentChange(
    usersJoinedIn(currentWindow[0], currentWindow[1]),
    usersJoinedIn(previousWindow[0], previousWindow[1]),
  );

  const activeBookings = bookings.filter(
    (b) => b.status === "confirmed" || b.status === "pending",
  ).length;
  const pendingTransactions = transactions.filter((t) => t.status === "pending").length;

  const totalRevenue = transactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.discountedAmount, 0);

  return [
    {
      id: "users",
      label: "Total Users",
      value: users.length,
      format: "number",
      changePct: usersChange,
      trend: toTrend(usersChange),
      hint: "vs previous 30 days",
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: totalRevenue,
      format: "fullCurrency",
      changePct: revenueChange,
      trend: toTrend(revenueChange),
      hint: "vs previous 30 days",
    },
    {
      id: "bookings",
      label: "Active Bookings",
      value: activeBookings,
      format: "number",
      changePct: bookingsChange,
      trend: toTrend(bookingsChange),
      hint: "vs previous 30 days",
    },
    {
      id: "pending",
      label: "Pending Transactions",
      value: pendingTransactions,
      format: "number",
      changePct: pendingChange,
      trend: toTrend(pendingChange),
      hint: "vs previous 30 days",
    },
  ];
}

function buildRevenueByMonth(transactions: Transaction[]): RevenuePoint[] {
  const buckets = new Map<string, { revenue: number; orders: number }>();
  const now = new Date();

  for (let i = 11; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.set(`${date.getFullYear()}-${date.getMonth()}`, {
      revenue: 0,
      orders: 0,
    });
  }

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.orders += 1;
    if (transaction.status === "paid") {
      bucket.revenue += transaction.discountedAmount;
    }
  }

  return Array.from(buckets.entries()).map(([key, value]) => {
    const monthIndex = Number(key.split("-")[1]);
    return { month: MONTH_LABELS[monthIndex], ...value };
  });
}

function buildTopProducts(transactions: Transaction[]): TopProduct[] {
  const products = new Map<string, TopProduct>();
  for (const transaction of transactions) {
    if (transaction.status === "failed") continue;
    for (const item of transaction.items) {
      const existing = products.get(item.title) ?? {
        title: item.title,
        thumbnail: item.thumbnail,
        unitsSold: 0,
        revenue: 0,
      };
      existing.unitsSold += item.quantity;
      existing.revenue += item.lineTotal;
      products.set(item.title, existing);
    }
  }
  return Array.from(products.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

function buildBookingsByCategory(bookings: Booking[]): CategoryPoint[] {
  const categories = new Map<string, CategoryPoint>();
  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;
    const existing = categories.get(booking.category) ?? {
      category: booking.category,
      bookings: 0,
      revenue: 0,
    };
    existing.bookings += 1;
    existing.revenue += booking.price;
    categories.set(booking.category, existing);
  }
  return Array.from(categories.values())
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 6);
}

/** Pure aggregation used by `useDashboardStats`. */
export function buildDashboardStats(
  transactions: Transaction[],
  bookings: Booking[],
  users: UserSummary[],
): DashboardStats {
  const paidTransactions = transactions.filter((t) => t.status === "paid");
  const pendingTransactions = transactions.filter((t) => t.status === "pending");
  const failedTransactions = transactions.filter((t) => t.status === "failed");

  const revenue = paidTransactions.reduce((sum, t) => sum + t.discountedAmount, 0);
  const pendingRevenue = pendingTransactions.reduce(
    (sum, t) => sum + t.discountedAmount,
    0,
  );

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const activeBookings = bookings.filter((b) => b.status !== "cancelled");
  const bookingSuccessRate = (activeBookings.length / Math.max(1, bookings.length)) * 100;

  const orderSlices: StatusSlice[] = [
    {
      status: "paid",
      label: "Paid",
      count: paidTransactions.length,
      amount: revenue,
    },
    {
      status: "pending",
      label: "Pending",
      count: pendingTransactions.length,
      amount: pendingRevenue,
    },
    {
      status: "failed",
      label: "Failed",
      count: failedTransactions.length,
      amount: failedTransactions.reduce((sum, t) => sum + t.discountedAmount, 0),
    },
  ];

  const bookingSlices: StatusSlice[] = (
    ["confirmed", "pending", "completed", "cancelled"] as const
  ).map((status) => ({
    status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
    count: bookings.filter((b) => b.status === status).length,
    amount: bookings
      .filter((b) => b.status === status)
      .reduce((sum, b) => sum + b.price, 0),
  }));

  return {
    kpis: buildKpis(transactions, bookings, users),
    revenueByMonth: buildRevenueByMonth(transactions),
    ordersByStatus: orderSlices,
    bookingsByStatus: bookingSlices,
    bookingsByCategory: buildBookingsByCategory(bookings),
    topProducts: buildTopProducts(transactions),
    recentTransactions: transactions.slice(0, 6),
    upcomingBookings: bookings
      .filter((b) => new Date(b.date).getTime() >= Date.now())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5),
    newCustomers: [],
    totals: {
      revenue,
      pendingRevenue,
      orders: transactions.length,
      paidOrders: paidTransactions.length,
      pendingOrders: pendingTransactions.length,
      failedOrders: failedTransactions.length,
      users: users.length,
      bookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      completedBookings: completedBookings.length,
      averageOrderValue: revenue / Math.max(1, paidTransactions.length),
      bookingSuccessRate,
    },
  };
}
