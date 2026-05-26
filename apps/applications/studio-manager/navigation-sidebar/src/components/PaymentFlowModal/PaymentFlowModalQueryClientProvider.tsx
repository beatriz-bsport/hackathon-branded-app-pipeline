import {
  QueryClient,
  QueryClientContext,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useContext, useState } from "react";

/** Provides QueryClient for PaymentFlowModal (kaizen uses react-query as peer). */
export function PaymentFlowModalQueryClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const existingClient = useContext(QueryClientContext);

  const [queryClient] = useState(
    () =>
      existingClient ??
      new QueryClient({
        defaultOptions: { queries: { staleTime: 2 * 60 * 1000 } },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
