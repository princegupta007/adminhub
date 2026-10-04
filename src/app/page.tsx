import { Suspense } from "react";

import { DashboardView } from "@/features/dashboard/components/dashboard-view";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardView />
    </Suspense>
  );
}
