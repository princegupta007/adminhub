import type { UserSummary } from "./types";

export const USER_STALE_TIME = 5 * 60 * 1000;

export const USER_STATUS_STYLES: Record<UserSummary["status"], string> = {
  active: "bg-success-soft text-success",
  inactive: "bg-muted text-muted-foreground",
  suspended: "bg-danger-soft text-danger",
};

export const USER_ROLE_STYLES: Record<string, string> = {
  Admin: "bg-brand-soft text-brand",
  Editor: "bg-blue-100 text-blue-600",
  Viewer: "bg-muted text-muted-foreground",
};
