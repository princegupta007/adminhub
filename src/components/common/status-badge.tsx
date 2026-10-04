import { cn } from "@/lib/utils";
import type { BookingStatus, TransactionStatus } from "@/lib/derive";

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

interface StatusConfig {
  label: string;
  tone: BadgeTone;
  dot: string;
}

const TRANSACTION_STATUS_CONFIG: Record<TransactionStatus, StatusConfig> = {
  paid: {
    label: "Completed",
    tone: "success",
    dot: "bg-success",
  },
  pending: {
    label: "Pending",
    tone: "warning",
    dot: "bg-warning",
  },
  failed: {
    label: "Failed",
    tone: "danger",
    dot: "bg-danger",
  },
  refunded: {
    label: "Refunded",
    tone: "neutral",
    dot: "bg-muted-foreground",
  },
};

const BOOKING_STATUS_CONFIG: Record<BookingStatus, StatusConfig> = {
  confirmed: {
    label: "Confirmed",
    tone: "info",
    dot: "bg-info",
  },
  pending: {
    label: "Pending",
    tone: "warning",
    dot: "bg-warning",
  },
  completed: {
    label: "Completed",
    tone: "success",
    dot: "bg-success",
  },
  cancelled: {
    label: "Cancelled",
    tone: "danger",
    dot: "bg-danger",
  },
};

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-muted text-muted-foreground",
};

export function TransactionStatusBadge({
  status,
  className,
}: {
  status: TransactionStatus;
  className?: string;
}) {
  const config = TRANSACTION_STATUS_CONFIG[status];
  return (
    <StatusBadge
      label={config.label}
      tone={config.tone}
      dot={config.dot}
      className={className}
    />
  );
}

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const config = BOOKING_STATUS_CONFIG[status];
  return (
    <StatusBadge
      label={config.label}
      tone={config.tone}
      dot={config.dot}
      className={className}
    />
  );
}

export function StatusBadge({
  label,
  tone,
  dot,
  className,
}: {
  label: string;
  tone: BadgeTone;
  dot?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", dot)} /> : null}
      {label}
    </span>
  );
}
