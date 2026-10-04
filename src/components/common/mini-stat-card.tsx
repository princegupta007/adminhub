import * as React from "react";
import { cn } from "@/lib/utils";

export interface MiniStatCardProps extends React.ComponentProps<"div"> {
  label: string;
  value: string | number | undefined;
  tone?: string;
  chart?: boolean;
}

export function MiniStatCard({
  label,
  value,
  tone,
  chart,
  className,
  ...props
}: MiniStatCardProps) {
  const displayValue = React.useMemo(() => {
    if (value === undefined) return "—";
    if (typeof value === "number") return value.toLocaleString("en-US");
    return value;
  }, [value]);

  return (
    <div
      className={cn(
        "bg-card flex min-h-[90px] flex-col justify-between rounded-xl border p-4",
        className,
      )}
      {...props}
    >
      <p className="text-muted-foreground text-[10px] font-medium sm:text-sm">{label}</p>
      <div className="mt-1 flex items-end justify-between">
        <p
          className={cn(
            "text-sm font-semibold tabular-nums sm:text-2xl",
            tone ?? "text-foreground",
          )}
        >
          {displayValue}
        </p>
        {chart && (
          <div className="text-success flex items-center pb-1">
            <svg
              width="60"
              height="24"
              viewBox="0 0 60 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 18 L14 10 L22 14 L32 4 L44 6 L58 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
