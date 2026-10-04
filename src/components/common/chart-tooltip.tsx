"use client";

/** Shared, minimal tooltip style used by all charts. */
export function ChartTooltipShell({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <div className="bg-popover rounded-lg border px-3 py-2 text-xs shadow-md">
      {label ? <p className="text-muted-foreground mb-1 font-medium">{label}</p> : null}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}
