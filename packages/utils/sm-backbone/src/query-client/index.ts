import { QueryClient } from "@tanstack/react-query";

/**
 * Generate a new QueryClient with default configuration.
 *
 * @default
 * The default configuration contains a custom defaultOptions.queries.retry method that
 * - doesn't retry on error
 */
export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
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
