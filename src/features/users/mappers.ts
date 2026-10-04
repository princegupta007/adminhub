import type { RawUser } from "@/types/api";
import { deriveJoinDate, deriveDateWithin, mulberry32 } from "@/lib/derive";
import type { UserDetails, UserRole, UserStatus, UserSummary } from "./types";

const WEIGHTED_ROLES: readonly UserRole[] = [
  "Viewer",
  "Viewer",
  "Viewer",
  "Viewer",
  "Viewer",
  "Editor",
  "Editor",
  "Editor",
  "Admin",
  "Admin",
];

const WEIGHTED_STATUSES: readonly UserStatus[] = [
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "active",
  "inactive",
  "suspended",
];

function deriveRole(id: number): UserRole {
  const random = mulberry32(id * 65537 + 17);
  return WEIGHTED_ROLES[Math.floor(random() * WEIGHTED_ROLES.length)];
}

function deriveStatus(id: number): UserStatus {
  const random = mulberry32(id * 40961 + 23);
  return WEIGHTED_STATUSES[Math.floor(random() * WEIGHTED_STATUSES.length)];
}

export function toUserSummary(raw: RawUser): UserSummary {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: raw.phone,
    avatar: raw.image,
    gender: raw.gender,
    age: raw.age,
    city: raw.address?.city ?? "—",
    country: raw.address?.country ?? "—",
    companyName: raw.company?.name ?? "—",
    jobTitle: raw.company?.title ?? "—",
    department: raw.company?.department ?? "—",
    role: deriveRole(raw.id),
    status: deriveStatus(raw.id),
    joinDate: deriveJoinDate(raw.id),
    lastActive: deriveDateWithin(raw.id * 31 + 5, 30, 0),
  };
}

export function toUserDetails(raw: RawUser): UserDetails {
  return {
    ...toUserSummary(raw),
    username: raw.username,
    birthDate: raw.birthDate,
    bloodGroup: raw.bloodGroup ?? "—",
    university: raw.university ?? "—",
    addressLine: raw.address?.address ?? "—",
    state: raw.address?.state ?? "—",
    eyeColor: raw.eyeColor ?? "—",
    hair: raw.hair ?? { color: "—", type: "—" },
    height: raw.height ?? 0,
    weight: raw.weight ?? 0,
    bank: {
      cardType: raw.bank?.cardType ?? "—",
      cardNumber: raw.bank?.cardNumber ?? "—",
      cardExpire: raw.bank?.cardExpire ?? "—",
      currency: raw.bank?.currency ?? "USD",
    },
  };
}
