import { AlertTriangle, CalendarClock, Clock, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface SystemAlert {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "danger" | "warning" | "info";
  icon: LucideIcon;
}

/**
 * Operational alerts widget. Alert copy is part of the design (demo data);
 * the pending-transactions count is derived from live data when provided.
 */
export function SystemAlerts({
  pendingTransactions,
  className,
}: {
  pendingTransactions?: number;
  className?: string;
}) {
  const alerts: SystemAlert[] = [
    {
      id: "capacity",
      title: "Server capacity at 92%",
      description: "Scale resources",
      time: "2 hours ago",
      tone: "danger",
      icon: AlertTriangle,
    },
    {
      id: "pending",
      title:
        pendingTransactions !== undefined
          ? `${pendingTransactions} transactions pending`
          : "15 transactions pending",
      description: "Pending review",
      time: "5 hours ago",
      tone: "warning",
      icon: Inbox,
    },
    {
      id: "maintenance",
      title: "System maintenance scheduled",
      description: "Scheduled for Oct 5",
      time: "Yesterday",
      tone: "info",
      icon: CalendarClock,
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">System Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="hover:bg-muted/60 flex items-start gap-3 rounded-lg px-2 py-3 transition-colors"
          >
            <span
              className={cn(
                "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
                alert.tone === "danger" && "bg-danger-soft text-danger",
                alert.tone === "warning" && "bg-warning-soft text-warning",
                alert.tone === "info" && "bg-info-soft text-info",
              )}
            >
              <alert.icon className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-medium">
                {alert.title}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {alert.description}
              </p>
              <p className="text-muted-foreground/80 mt-1 flex items-center gap-1 text-[11px]">
                <Clock className="size-3" aria-hidden="true" />
                {alert.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
