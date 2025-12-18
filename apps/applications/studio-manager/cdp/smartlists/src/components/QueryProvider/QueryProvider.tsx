import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PropsWithChildren } from "react";

import { HTTPException } from "@bsport/fetch";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on client errors (4xx)
        if (error instanceof HTTPException && error.type === "ClientError") {
          return false;
        }
        // Retry up to 3 times for other errors (5xx, network errors)
        return failureCount < 3;
      },
    },
  },
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
