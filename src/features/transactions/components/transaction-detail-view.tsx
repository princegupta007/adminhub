"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/common/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ComingSoonDialog } from "@/components/common/coming-soon-dialog";
import { useTransactions } from "../hooks";
import { useTodayLabel } from "@/lib/use-now";
import { TopbarSearch } from "@/components/common/topbar-search";
import { TransactionDetailDesktop } from "./transaction-detail-desktop";
import { TransactionDetailMobile } from "./transaction-detail-mobile";

export function TransactionDetailView({ id }: { id: string }) {
  const { transactions, isPending, error, refetch } = useTransactions();
  const todayLabel = useTodayLabel();
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const transaction = transactions?.find((item) => item.id === id);

  if (error) {
    return (
      <AppShell title="Transactions Log" subtitle={todayLabel ?? undefined}>
        <ErrorState onRetry={refetch} />
      </AppShell>
    );
  }

  if (isPending || !transaction) {
    return (
      <AppShell title="Transactions Log" subtitle={todayLabel ?? undefined}>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  const txnId = `TXN-${1000 + transaction.cartId}`;
  const gatewayFee = 4.9;
  const subtotal = transaction.discountedAmount - gatewayFee;

  return (
    <AppShell
      title="Transactions Log"
      subtitle={todayLabel ?? undefined}
      mobileHeading={false}
      topbarActions={<TopbarSearch />}
    >
      <TransactionDetailDesktop
        transaction={transaction}
        txnId={txnId}
        gatewayFee={gatewayFee}
        subtotal={subtotal}
        setComingSoonOpen={setComingSoonOpen}
      />
      <TransactionDetailMobile
        transaction={transaction}
        txnId={txnId}
        gatewayFee={gatewayFee}
        setComingSoonOpen={setComingSoonOpen}
      />

      <ComingSoonDialog open={comingSoonOpen} onOpenChange={setComingSoonOpen} />
    </AppShell>
  );
}
