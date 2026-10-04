import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * AdminHub brand mark — logomark tile + wordmark, used in the desktop
 * sidebar and the mobile topbar.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "focus-visible:ring-ring/50 flex items-center gap-2.5 focus-visible:ring-[3px] focus-visible:outline-none",
        className,
      )}
    >
      <div className="relative flex size-8 items-center justify-center overflow-hidden rounded-lg">
        <Image src="/logo.png" alt="AdminHub Logo" fill className="object-cover" />
      </div>
      <span className="text-base font-semibold tracking-tight">AdminHub</span>
    </Link>
  );
}
