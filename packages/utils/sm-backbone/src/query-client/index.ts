import { QueryClient } from "@tanstack/react-query";

import { HTTPException } from "@bsport/fetch";

const isClientError = (error: unknown) =>
  (error instanceof HTTPException && error.type === "ClientError") ||
  (typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error as { type?: unknown }).type === "ClientError");

/**
 * Generate a new QueryClient with default configuration.
 *
 * @default
 * The default configuration contains a custom defaultOptions.queries.retry method that
 * - doesn't refretch on ClientError (4xx)
 * - retries up to 3 times for other errors (5xx, network errors)
 */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // Don't retry on client errors (4xx)
          if (isClientError(error)) {
            return false;
          }
          // Retry up to 3 times for other errors (5xx, network errors)
          return failureCount < 3;
        },
      },
    },
  });
}

let defaultQueryClient: QueryClient | null = null;

export function getDefaultQueryClient() {
  if (!defaultQueryClient) {
    defaultQueryClient = createAppQueryClient();
  }
  return defaultQueryClient;
}
