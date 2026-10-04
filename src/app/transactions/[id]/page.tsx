import { TransactionDetailView } from "@/features/transactions/components/transaction-detail-view";

export const metadata = {
  title: "Transaction Details",
};

export default async function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionDetailView id={id} />;
}
