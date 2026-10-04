import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface DataTableLayoutProps {
  /** The top toolbar area (search, filters, etc.) */
  toolbar?: ReactNode;
  /** The bulk actions row (usually shown when items are selected) */
  bulkActions?: ReactNode;
  /** The data table component itself */
  table: ReactNode;
  /** The pagination component */
  pagination?: ReactNode;
  /** Optional overlay to replace the table area (e.g., ErrorState) */
  overlay?: ReactNode;
}

/**
 * A reusable layout wrapper for data tables that ensures correct flexbox
 * heights and scrollable table areas while keeping the page height constrained.
 */
export function DataTableLayout({
  toolbar,
  bulkActions,
  table,
  pagination,
  overlay,
}: DataTableLayoutProps) {
  return (
    <Card className="flex min-h-0 flex-1 flex-col shadow-none">
      <CardContent className="flex min-h-0 flex-1 flex-col space-y-4 p-4 sm:p-5">
        {toolbar && <div className="shrink-0">{toolbar}</div>}
        {bulkActions && <div className="shrink-0">{bulkActions}</div>}

        {overlay ? (
          <div className="shrink-0">{overlay}</div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto rounded-md border">{table}</div>
        )}

        {pagination && <div className="shrink-0">{pagination}</div>}
      </CardContent>
    </Card>
  );
}
