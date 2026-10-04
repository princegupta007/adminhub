"use client";

import { useTodayLabel } from "@/lib/use-now";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { TopbarSearch } from "@/components/common/topbar-search";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { useTableState, useAppDispatch } from "@/store/hooks";
import { useTransactions } from "../hooks";
import { useTransactionColumns } from "./transaction-columns";
import { TransactionsDesktopView } from "./transactions-desktop-view";
import { TransactionsMobileList } from "./transactions-mobile-list";

import { APP_CONSTANTS } from "@/lib/constants";

export function TransactionsView() {
  const dispatch = useAppDispatch();
  const table = useTableState("transactions");
  const columns = useTransactionColumns();
  const { transactions, isPending, error, refetch } = useTransactions();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const statusFilter = table.filters.status ?? "all";

  const filtered = useMemo(() => {
    if (!transactions) return [];
    const needle = table.search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      if (statusFilter !== "all" && transaction.status !== statusFilter) {
        return false;
      }
      if (!needle) return true;
      const haystack =
        `${transaction.id} ${transaction.customerName} ${transaction.customerEmail ?? ""} ${transaction.paymentMethod}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [transactions, table.search, statusFilter]);

  const sorted = useMemo(() => {
    const direction = table.sortDirection === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (table.sortBy) {
        case "user":
          return a.customerName.localeCompare(b.customerName) * direction;
        case "amount":
          return (a.discountedAmount - b.discountedAmount) * direction;
        case "status":
          return a.status.localeCompare(b.status) * direction;
        case "date":
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
        case "id":
        default:
          return (a.cartId - b.cartId) * direction;
      }
    });
  }, [filtered, table.sortBy, table.sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sorted.length / APP_CONSTANTS.TABLE_PAGE_SIZE),
  );
  const page = Math.min(table.page, totalPages);
  const rows = sorted.slice(
    (page - 1) * APP_CONSTANTS.TABLE_PAGE_SIZE,
    page * APP_CONSTANTS.TABLE_PAGE_SIZE,
  );

  const stats = useMemo(() => {
    if (!transactions) return null;
    const paid = transactions.filter((t) => t.status === "paid");
    const pending = transactions.filter((t) => t.status === "pending");
    return {
      total: transactions.length,
      revenue: paid.reduce((sum, t) => sum + t.discountedAmount, 0),
      avg:
        paid.length > 0
          ? paid.reduce((sum, t) => sum + t.discountedAmount, 0) / paid.length
          : 0,
      pending: pending.length,
    };
  }, [transactions]);

  const todayLabel = useTodayLabel();
  return (
    <AppShell
      title="Transactions Ledger"
      subtitle={todayLabel ?? undefined}
      topbarActions={<TopbarSearch />}
      mobileHeading={false}
    >
      <TransactionsDesktopView
        rows={rows}
        sortedLength={sorted.length}
        page={page}
        isPending={isPending}
        error={error}
        refetch={refetch}
        table={table}
        columns={columns}
        stats={stats}
        statusFilter={statusFilter}
        dispatch={dispatch}
        setComingSoonOpen={setComingSoonOpen}
      />

      <TransactionsMobileList
        rows={rows}
        error={error}
        refetch={refetch}
        table={table}
        stats={stats}
        statusFilter={statusFilter}
        dispatch={dispatch}
      />

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}
