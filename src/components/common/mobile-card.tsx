import type { ReactNode } from "react";

interface MobileCardProps {
  /** The top section (e.g., ID and Status badge) */
  top: ReactNode;
  /** The middle section (e.g., User info and Amount) */
  middle: ReactNode;
  /** The bottom section (e.g., Date and Actions) */
  bottom: ReactNode;
}

/**
 * A reusable mobile card component designed to render list items
 * elegantly on small screens, matching the Figma design.
 */
export function MobileCard({ top, middle, bottom }: MobileCardProps) {
  return (
    <div className="bg-card flex flex-col rounded-xl border px-4 py-3.5">
      {/* Top Row with subtle divider */}
      <div className="border-border/50 flex items-center justify-between border-b pb-3">
        {top}
      </div>

      {/* Middle Row */}
      <div className="flex items-center justify-between pt-3 pb-2">{middle}</div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between">{bottom}</div>
    </div>
  );
}
