import { Activity, Database, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HealthMetric {
  label: string;
  value: string;
  icon: LucideIcon;
}

/** Infrastructure health widget (design demo values). */
export function SystemHealth({ className }: { className?: string }) {
  const metrics: HealthMetric[] = [
    { label: "Uptime", value: "99.8%", icon: Activity },
    { label: "Avg Response Time", value: "142ms", icon: Timer },
    { label: "Active Sessions", value: "3,241", icon: Database },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-border divide-y">
          {metrics.map((metric) => (
            <li
              key={metric.label}
              // Mobile design shows only Uptime + Avg Response Time.
              className={
                metric.label === "Active Sessions"
                  ? "hidden items-center justify-between gap-3 py-3 sm:flex"
                  : "flex items-center justify-between gap-3 py-3"
              }
            >
              <span className="text-muted-foreground flex items-center gap-2.5 text-sm">
                <metric.icon
                  className="text-muted-foreground/70 size-4"
                  aria-hidden="true"
                />
                {metric.label}
              </span>
              <span className="text-foreground text-sm font-semibold tabular-nums">
                {metric.value}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
