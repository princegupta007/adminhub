import { Eye } from "lucide-react";

import { DataTable, type DataTableColumn } from "@/components/common/data-table";
import { UserCell } from "@/components/common/user-cell";
import { TransactionStatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/formatters";
import type { Transaction, TransactionStatus } from "../types";

import { getTransactionType, getTypeStyle } from "../utils";

export function formatDateTime(isoString: string) {
  const d = new Date(isoString);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

export function useTransactionColumns(): DataTableColumn<Transaction>[] {
  return [
    {
      id: "id",
      header: "TRANSACTION ID",
      cell: (row) => (
        <span className="text-muted-foreground text-sm font-semibold">
          #TXN-{1000 + row.cartId}
        </span>
      ),
      sortValue: (row) => row.cartId,
      cellClassName: "pl-4",
    },
    {
      id: "user",
      header: "USER",
      cell: (row) => (
        <UserCell
          firstName={row.customerFirstName}
          lastName={row.customerLastName}
          avatarUrl={row.customerAvatar}
          subtitle={row.customerEmail ?? undefined}
        />
      ),
      sortValue: (row) => row.customerName,
    },
    {
      id: "type",
      header: "TYPE",
      cell: (row) => {
        const type = getTransactionType(row.cartId);
        return (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold ${getTypeStyle(type)}`}
          >
            {type}
          </span>
        );
      },
    },
    {
      id: "amount",
      header: "AMOUNT",
      cell: (row) => {
        const type = getTransactionType(row.cartId);
        const amount = type === "Refund" ? -row.discountedAmount : row.discountedAmount;
        return (
          <span
            className={`text-sm font-bold tabular-nums ${type === "Refund" ? "text-danger" : "text-foreground"}`}
          >
            {type === "Refund" ? "-" : ""}
            {formatCurrency(Math.abs(amount))}
          </span>
        );
      },
      sortValue: (row) => row.discountedAmount,
      cellClassName: "text-left",
    },
    {
      id: "status",
      header: "STATUS",
      cell: (row) => {
        // Map the fake type/status to the mockup's statuses
        const type = getTransactionType(row.cartId);
        let status = row.status;
        if (type === "Refund") status = "refunded" as TransactionStatus;

        return <TransactionStatusBadge status={status} />;
      },
      sortValue: (row) => row.status,
    },
    {
      id: "date",
      header: "DATE & TIME",
      cell: (row) => (
        <span className="text-muted-foreground text-sm font-medium">
          {formatDateTime(row.date)}
        </span>
      ),
      sortValue: (row) => new Date(row.date).getTime(),
    },
    {
      id: "action",
      header: "ACTIONS",
      cell: () => (
        <span className="text-muted-foreground hover:text-foreground inline-flex size-8 cursor-pointer items-center justify-center">
          <Eye className="size-[18px]" aria-hidden="true" />
          <span className="sr-only">View transaction</span>
        </span>
      ),
      headerClassName: "text-right",
      cellClassName: "text-right pr-4",
    },
  ];
}

export { DataTable };
