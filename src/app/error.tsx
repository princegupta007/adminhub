"use client";

import { useEffect } from "react";
import { RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-foreground text-xl font-semibold">This page hit a snag</h1>
      <p className="text-muted-foreground max-w-md text-sm">
        An unexpected error occurred while rendering this page. You can try again — if the
        problem persists, check the console for details.
      </p>
      <Button onClick={reset} className="mt-2">
        <RotateCw aria-hidden="true" />
        Try again
      </Button>
    </div>
  );
}
