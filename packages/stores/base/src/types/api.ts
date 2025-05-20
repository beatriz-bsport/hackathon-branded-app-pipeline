import type { Result } from "typescript-result";

// ----- Fetch Handler -----
// Refer to `packages/utils/fetch/src/fetch.ts`

export type Fetch<T = string> = (
  uri: string,
  init?: RequestInit & { responseType?: "text" | "json" | "buffer" },
) => Promise<{ data: T; status: number }>;

/**
 * Describe a complete API call, which can be passed to `fetch`.
 */
export type ApiConfig = Parameters<Fetch>;

/**
 * Describe the interface to use an action that performs state update, in a consuming application
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

// ----- Xhr Handler -----
// Refer to `packages/utils/fetch/src/xhr.ts`

type Xhr<T = string> = (
  uri: string,
  init: {
    method?: RequestInit["method"];
    headers?: HeadersInit;
    signal?: AbortSignal;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
    formData?: FormData;
  },
) => Promise<{ data: T; status: number }>;

/**
 * Describe a complete API call, which can be passed to `xhr`.
 */
export type XhrApiConfig = Parameters<Xhr>;

/**
 * Describe the interface to use a action that relies on xhr, in a consuming application
 */
export type XhrAction<
  Params,
  XhrReturn,
  E = Error,
  ActionReturn = XhrReturn,
> = (xhr: Xhr<XhrReturn>, params: Params) => Promise<Result<ActionReturn, E>>;

// ----- Response patterns -----

export type PaginatedResponse<T = void> = {
  count: number;
  links: { next: number | null; previous: number | null };
  next_page: number | null;
  page: number;
  results: T[];
};
