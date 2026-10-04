export function getTransactionType(id: number) {
  const hash = id % 3;
  if (hash === 0) return "Payment";
  if (hash === 1) return "Refund";
  return "Transfer";
}

export function getTypeStyle(type: string) {
  if (type === "Payment") return "bg-[#e5efff] text-[#3478ff]";
  if (type === "Refund") return "bg-[#ffe5e5] text-[#ff3434]";
  return "bg-transparent text-[#3478ff] border border-[#3478ff]/30";
}
