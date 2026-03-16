import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useEffect } from "react";

interface ReactQueryProviderProps {
  children: ReactNode;
  client: QueryClient;
}

export const ReactQueryProvider = ({
  children,
  client,
}: ReactQueryProviderProps) => {
  useEffect(() => {
    if (import.meta.env.DEV && !window.__TANSTACK_QUERY_CLIENT__) {
      window.__TANSTACK_QUERY_CLIENT__ = client;
    }
  }, [client]);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
