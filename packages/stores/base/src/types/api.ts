import type { Result } from "typescript-result";
import type { Fetch } from "@bsport/fetch";

/**
 * A stateful action that can modify state.
 */
export type Action<P, R extends Result<unknown, unknown>> = (
  fetch: Fetch,
  params: P,
) => Promise<R>;

/**
 * An action with generic error class
 */
export type GenericAction<P, R> = (
  fetch: Fetch,
  params: P,
) => Promise<Result<R, Error>>;

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
