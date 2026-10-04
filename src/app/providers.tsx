"use client";

import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { makeQueryClient } from "@/lib/query-client";
import { makeStore, type AppStore } from "@/store";

/**
 * Client-side providers: Redux Toolkit for UI state and TanStack Query
 * for all server state. Mounted once in the root layout.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [store] = useState<AppStore>(makeStore);
  const [queryClient] = useState(makeQueryClient);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
