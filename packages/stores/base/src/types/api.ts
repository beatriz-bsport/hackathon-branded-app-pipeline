import type { Result } from "typescript-result";

// Refer to `packages/utils/fetch/src/fetch.ts

type Fetch<T = string> = (
  uri: string,
  init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
) => Promise<{ data: T; status: number }>;

/**
 * A stateful action that can modify state.
 */
export type Action<
  Params,
  FetchReturn,
  E = Error,
  ActionReturn = FetchReturn,
> = (
  fetch: Fetch<FetchReturn>,
  params: Params,
) => Promise<Result<ActionReturn, E>>;

/**
 * Type describing a complete API call, which can be passed to `fetch`.
 */
export type ApiConfig = Parameters<Fetch>;

export type PaginatedResponse<T = void> = {
  count: number;
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  page: number;
  results: T[];
};
