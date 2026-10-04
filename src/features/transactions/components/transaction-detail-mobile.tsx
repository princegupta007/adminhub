import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatusBadge } from "@/components/common/status-badge";
import { formatCurrency } from "@/lib/formatters";
import { formatDateTime } from "./transaction-columns";
import { APP_ROUTES } from "@/lib/constants";
import type { Transaction } from "../types";
export function TransactionDetailMobile({
  transaction,
  txnId,
  gatewayFee,
  setComingSoonOpen,
}: {
  transaction: Transaction;
  txnId: string;
  gatewayFee: number;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="flex flex-col pb-4 sm:hidden">
      <div className="mb-4 flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <Link
            href={APP_ROUTES.TRANSACTIONS}
            className="text-muted-foreground -ml-1 p-1"
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
          <h1 className="text-foreground text-lg font-bold">Transaction Detail</h1>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="text-muted-foreground size-8 bg-white"
          onClick={() => setComingSoonOpen(true)}
        >
          <Printer className="size-4" aria-hidden="true" />
        </Button>
      </div>

      <Card className="mb-4 py-6 text-center">
        <p className="text-muted-foreground mb-2 text-sm">Transaction #{txnId}</p>
        <h2 className="text-foreground mb-3 text-4xl font-black">
          {formatCurrency(transaction.discountedAmount)}
        </h2>
        <div className="flex justify-center">
          <TransactionStatusBadge status={transaction.status} />
        </div>
      </Card>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Button
          className="w-full bg-[#5c4dff] text-white hover:bg-[#5c4dff]/90"
          onClick={() => setComingSoonOpen(true)}
        >
          Refund
        </Button>
        <Button
          variant="outline"
          className="w-full bg-white"
          onClick={() => setComingSoonOpen(true)}
        >
          Print Receipt
        </Button>
      </div>

      <Card className="mb-4">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm font-bold">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Type</span>
            <span className="text-foreground font-semibold">Subscription Payment</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Method</span>
            <span className="text-foreground font-semibold">
              Credit Card (**** {4000 + (transaction.userId % 1000)})
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Date & Time</span>
            <span className="text-foreground font-semibold">
              {formatDateTime(transaction.date)}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Reference ID</span>
            <span className="text-foreground font-semibold">
              ref_{Math.floor(transaction.userId * 87632 + 10000000)}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Processing Fee</span>
            <span className="text-foreground font-semibold">
              {formatCurrency(gatewayFee)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm font-bold">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Name</span>
            <span className="text-foreground font-semibold">
              {transaction.customerFirstName} {transaction.customerLastName}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground font-semibold">
              {transaction.customerEmail}
            </span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-foreground font-semibold">+1 555-0123</span>
          </div>
          <hr className="border-border" />
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Account ID</span>
            <span className="text-foreground font-semibold">
              #USR-{transaction.userId}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader className="px-4 pt-4 pb-3">
          <CardTitle className="text-sm font-bold">Status Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0 px-4 pb-4">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="bg-success mt-1 size-2.5 shrink-0 rounded-full" />
              <div className="bg-border my-1 h-10 w-px" />
            </div>
            <div className="pb-3">
              <p className="text-foreground text-xs font-semibold">
                Transaction Completed
              </p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                Funds successfully settled into merchant vault.
                <br />
                {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 size-2.5 shrink-0 rounded-full bg-[#5c4dff]" />
              <div className="bg-border my-1 h-10 w-px" />
            </div>
            <div className="pb-3">
              <p className="text-foreground text-xs font-semibold">Processing</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                Card authenticated via 3D Secure.
                <br />
                {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="mt-1 size-2.5 shrink-0 rounded-full bg-[#5c4dff]" />
            </div>
            <div className="pb-1">
              <p className="text-foreground text-xs font-semibold">Initiated</p>
              <p className="text-muted-foreground mt-0.5 text-[10px] leading-snug">
                Payment request received from mobile checkout.
                <br />
                {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
