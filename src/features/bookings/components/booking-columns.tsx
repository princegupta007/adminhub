import { Eye, Pencil } from "lucide-react";

import type { DataTableColumn } from "@/components/common/data-table";
import { UserCell } from "@/components/common/user-cell";
import { BookingStatusBadge } from "@/components/common/status-badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import type { Booking } from "../types";

export function useBookingColumns(): DataTableColumn<Booking>[] {
  return [
    {
      id: "id",
      header: "Booking ID",
      cell: (row) => (
        <span className="text-foreground font-mono text-sm font-semibold">
          #BKG-{1000 + row.todoId}
        </span>
      ),
      sortValue: (row) => row.todoId,
      cellClassName: "pl-4",
    },
    {
      id: "customer",
      header: "Customer",
      cell: (row) => (
        <UserCell
          firstName={row.customerName.split(" ")[0]}
          lastName={row.customerName.split(" ").slice(1).join(" ")}
          avatarUrl={`https://i.pravatar.cc/150?u=${row.id}`}
        />
      ),
      sortValue: (row) => row.customerName,
    },
    {
      id: "service",
      header: "Service",
      cell: (row) => <p className="text-foreground text-sm">{row.service}</p>,
      sortValue: (row) => row.service,
    },
    {
      id: "date",
      header: "Date & Time",
      cell: (row) => (
        <div className="leading-tight">
          <p className="text-foreground text-sm">
            {formatDate(row.date)} {row.time}
          </p>
        </div>
      ),
      sortValue: (row) => new Date(row.date).getTime(),
    },
    {
      id: "duration",
      header: "Duration",
      cell: () => <p className="text-foreground text-sm">1.5 hrs</p>,
      sortValue: () => 0,
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <BookingStatusBadge status={row.status} />,
      sortValue: (row) => row.status,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="text-foreground text-sm font-bold tabular-nums">
          {formatCurrency(row.price)}
        </span>
      ),
      sortValue: (row) => row.price,
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="text-muted-foreground flex items-center justify-end gap-3">
          <Eye className="hover:text-foreground size-4 cursor-pointer transition-colors" />
          <Pencil className="hover:text-foreground size-4 cursor-pointer transition-colors" />
        </div>
      ),
      headerClassName: "text-right pr-6",
      cellClassName: "text-right pr-6",
    },
  ];
}
