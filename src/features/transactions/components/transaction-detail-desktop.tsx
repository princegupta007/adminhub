import Link from "next/link";
import { ArrowLeftRight, Check, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionStatusBadge } from "@/components/common/status-badge";
import { UserCell } from "@/components/common/user-cell";
import { formatCurrency } from "@/lib/formatters";
import { formatDateTime } from "./transaction-columns";
import { APP_ROUTES } from "@/lib/constants";
import type { Transaction } from "../types";
export function TransactionDetailDesktop({
  transaction,
  txnId,
  gatewayFee,
  subtotal,
  setComingSoonOpen,
}: {
  transaction: Transaction;
  txnId: string;
  gatewayFee: number;
  subtotal: number;
  setComingSoonOpen: (open: boolean) => void;
}) {
  return (
    <div className="hidden sm:block">
      <div className="text-muted-foreground mb-4 flex gap-2 text-sm">
        <Link
          href={APP_ROUTES.TRANSACTIONS}
          className="hover:text-foreground transition-colors"
        >
          Transactions
        </Link>
        <span>/</span>
        <span className="text-foreground font-semibold">#{txnId}</span>
      </div>

      <Card className="mb-6">
        <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-4">
            <div className="bg-success-soft text-success flex size-12 shrink-0 items-center justify-center rounded-full">
              <ArrowLeftRight className="size-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-xl font-bold">
                Transaction #{txnId}
                <TransactionStatusBadge status={transaction.status} />
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Reference #REF-{Math.floor(transaction.userId * 87632 + 10000000)} •
                Generated on {formatDateTime(transaction.date)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-white"
              onClick={() => setComingSoonOpen(true)}
            >
              <Printer className="mr-2 size-4" aria-hidden="true" />
              Print Receipt
            </Button>
            <Button
              className="bg-[#5c4dff] text-white hover:bg-[#5c4dff]/90"
              onClick={() => setComingSoonOpen(true)}
            >
              Refund Transaction
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">
                Transaction Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Transaction Type</span>
                <span className="text-foreground font-semibold">Service Payment</span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="text-foreground font-semibold">
                  Credit Card ({transaction.paymentMethod} ending in{" "}
                  {4000 + (transaction.userId % 1000)})
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Processing Gateway Fee</span>
                <span className="text-foreground font-semibold">
                  {formatCurrency(gatewayFee)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-semibold">
                  {formatCurrency(subtotal > 0 ? subtotal : 0)}
                </span>
              </div>
              <hr className="border-border" />
              <div className="flex items-center justify-between pt-2 text-sm">
                <span className="text-foreground font-bold">Grand Total</span>
                <span className="text-xl font-bold text-[#5c4dff]">
                  {formatCurrency(transaction.discountedAmount)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold">
                Customer Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <UserCell
                  firstName={transaction.customerFirstName}
                  lastName={transaction.customerLastName}
                  avatarUrl={transaction.customerAvatar}
                  subtitle={`${transaction.customerEmail} • ID #USR-${transaction.userId}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-6">
              <CardTitle className="text-base font-bold">Processing History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="bg-success-soft text-success flex size-6 shrink-0 items-center justify-center rounded-full">
                    <Check className="size-3.5" aria-hidden="true" />
                  </div>
                  <div className="bg-border my-1 h-12 w-px" />
                </div>
                <div className="pt-0.5 pb-4">
                  <p className="text-foreground text-sm font-semibold">
                    Completed & Disbursed
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Settled in merchant bank account
                    <br />
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-[#5c4dff]">
                    <Check className="size-3.5" aria-hidden="true" />
                  </div>
                  <div className="bg-border my-1 h-12 w-px" />
                </div>
                <div className="pt-0.5 pb-4">
                  <p className="text-foreground text-sm font-semibold">
                    Processing & Authorized
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Visa Gateway auth approved
                    <br />
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f3f0ff] text-[#5c4dff]">
                    <Check className="size-3.5" aria-hidden="true" />
                  </div>
                </div>
                <div className="pt-0.5">
                  <p className="text-foreground text-sm font-semibold">Initiated</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Checkout session initialized
                    <br />
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">
            Related Customer Ledger Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-muted-foreground bg-muted/50 border-b text-left text-xs font-semibold">
                  <th className="rounded-tl-lg rounded-bl-lg px-4 py-3 font-semibold">
                    TRANSACTION ID
                  </th>
                  <th className="px-4 py-3 font-semibold">GATEWAY METHOD</th>
                  <th className="px-4 py-3 font-semibold">AMOUNT</th>
                  <th className="px-4 py-3 font-semibold">STATUS</th>
                  <th className="rounded-tr-lg rounded-br-lg px-4 py-3 font-semibold">
                    SETTLED AT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                <tr>
                  <td className="text-foreground px-4 py-4 font-semibold">#TXN-7102</td>
                  <td className="text-muted-foreground px-4 py-4">Visa Card (*4582)</td>
                  <td className="text-foreground px-4 py-4 font-bold">$120.00</td>
                  <td className="px-4 py-4">
                    <TransactionStatusBadge status="paid" />
                  </td>
                  <td className="text-muted-foreground px-4 py-4">Aug 15, 2024 10:14</td>
                </tr>
                <tr>
                  <td className="text-foreground px-4 py-4 font-semibold">#TXN-5921</td>
                  <td className="text-muted-foreground px-4 py-4">Direct PayPal Link</td>
                  <td className="text-foreground px-4 py-4 font-bold">$350.00</td>
                  <td className="px-4 py-4">
                    <TransactionStatusBadge status="paid" />
                  </td>
                  <td className="text-muted-foreground px-4 py-4">Jul 02, 2024 16:50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
