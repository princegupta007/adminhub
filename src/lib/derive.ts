/**
 * Deterministic derivations.
 *
 * The public APIs we use (DummyJSON) do not expose real-world fields such as
 * order dates, payment statuses or booking services. To keep the dashboard
 * realistic we derive those fields *deterministically* from stable ids, so
 * every refetch produces exactly the same data (no flicker, no lying charts).
 */

/** Small deterministic PRNG (mulberry32). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

/** Returns an ISO date between `daysBack` and `daysFromNow` (exclusive bounds). */
export function deriveDateWithin(
  seed: number,
  daysBack: number,
  daysFromNow: number,
): string {
  const random = mulberry32(seed * 2654435761);
  const span = daysBack + daysFromNow;
  const offset = Math.floor(random() * span) - daysBack;
  const date = new Date();
  date.setHours(9 + Math.floor(random() * 10), Math.floor(random() * 60), 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export const TRANSACTION_STATUSES = ["paid", "pending", "failed", "refunded"] as const;
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

const PAYMENT_METHODS = ["VISA", "Mastercard", "PayPal", "Amex", "Apple Pay"] as const;

const WEIGHTED_TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  "paid",
  "paid",
  "paid",
  "paid",
  "paid",
  "paid",
  "pending",
  "pending",
  "pending",
  "failed",
];

export function deriveTransactionStatus(seed: number): TransactionStatus {
  const random = mulberry32(seed * 7919 + 13);
  return pick(WEIGHTED_TRANSACTION_STATUSES, random);
}

export function derivePaymentMethod(seed: number): string {
  const random = mulberry32(seed * 104729 + 7);
  return pick(PAYMENT_METHODS, random);
}

export const BOOKING_STATUSES = [
  "confirmed",
  "pending",
  "cancelled",
  "completed",
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export function deriveBookingStatus(seed: number, completed: boolean): BookingStatus {
  if (completed) return "completed";
  const random = mulberry32(seed * 31337 + 29);
  return pick(
    ["confirmed", "confirmed", "pending", "pending", "cancelled"] as const,
    random,
  );
}

/** Static catalogue of bookable services (assignment allows static mapping tables). */
export const BOOKING_SERVICES = [
  { service: "Home Deep Cleaning", category: "Cleaning" },
  { service: "Weekly House Keeping", category: "Cleaning" },
  { service: "Plumbing Inspection", category: "Plumbing" },
  { service: "AC Service & Repair", category: "Appliances" },
  { service: "Electrical Wiring Check", category: "Electrical" },
  { service: "Painting — Living Room", category: "Painting" },
  { service: "Carpentry Work", category: "Carpentry" },
  { service: "Pest Control Treatment", category: "Pest Control" },
  { service: "Garden Maintenance", category: "Gardening" },
  { service: "Salon at Home — Women", category: "Beauty" },
  { service: "Massage Therapy", category: "Wellness" },
  { service: "Deep Kitchen Cleaning", category: "Cleaning" },
  { service: "Bathroom Sanitisation", category: "Cleaning" },
  { service: "Sofa & Carpet Shampoo", category: "Cleaning" },
  { service: "Water Purifier Service", category: "Appliances" },
  { service: "Geyser Installation", category: "Appliances" },
  { service: "TV Mounting", category: "Electrical" },
  { service: "Smart Lock Setup", category: "Electrical" },
  { service: "Interior Consultation", category: "Design" },
  { service: "Moving & Packing Help", category: "Moving" },
] as const;

export function deriveBookingService(seed: number): {
  service: string;
  category: string;
} {
  const random = mulberry32(seed * 15485863 + 97);
  const entry = BOOKING_SERVICES[Math.floor(random() * BOOKING_SERVICES.length)];
  return { service: entry.service, category: entry.category };
}

/** Deterministic price band for a booking (kept in a realistic $39–$249 range). */
export function deriveBookingPrice(seed: number): number {
  const random = mulberry32(seed * 22801763489 + 3);
  return Math.round((39 + random() * 210) * 100) / 100;
}

/** Deterministic time slot for a booking. */
export function deriveBookingTime(seed: number): string {
  const random = mulberry32(seed * 32452843 + 11);
  const hour = 8 + Math.floor(random() * 11);
  const minutes = random() < 0.5 ? "00" : "30";
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour > 12 ? hour - 12 : hour;
  return `${display}:${minutes} ${suffix}`;
}

/**
 * Derives a stable "customer since" join date from a user id so the
 * users table can show a realistic, consistent registration date.
 */
export function deriveJoinDate(seed: number): string {
  return deriveDateWithin(seed, 1095, 0);
}
