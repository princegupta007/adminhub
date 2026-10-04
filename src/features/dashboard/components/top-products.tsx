import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactCurrency, formatNumber } from "@/lib/formatters";
import type { TopProduct } from "../types";

/** Best-selling products ranked by revenue (live data). */
export function TopProducts({
  products,
  className,
}: {
  products: TopProduct[];
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
          <div key={product.title} className="flex items-center gap-3">
            <span className="text-muted-foreground w-4 text-xs font-semibold tabular-nums">
              {index + 1}
            </span>
            <Image
              src={product.thumbnail}
              alt=""
              aria-hidden="true"
              width={36}
              height={36}
              className="bg-muted size-9 shrink-0 rounded-lg border object-cover"
              unoptimized
            />
            <div className="min-w-0 flex-1">
              <p className="text-foreground truncate text-sm font-medium">
                {product.title}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatNumber(product.unitsSold)} sold
              </p>
            </div>
            <p className="text-foreground text-sm font-semibold tabular-nums">
              {formatCompactCurrency(product.revenue)}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
