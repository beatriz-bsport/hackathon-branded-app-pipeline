import { infiniteQueryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL_PAYMENT_PACK, QUERY_KEY_MAIN } from "#src/constants";
import {
  createAPI,
  createInfiniteQueryOptions,
  createQueryOptions,
} from "#src/shared";

import type { FetchPassesParams, Pass, SearchPassesParams } from "./types";

// ----------------------------------------------------------------------------

const PASS_API_URL = `${API_V1_URL_PAYMENT_PACK}/payment-pack`;

export const passKeys = {
  all: [QUERY_KEY_MAIN, "pass"] as const,

  lists: () => [...passKeys.all, "list"] as const,
  list: (params: FetchPassesParams) => [...passKeys.lists(), params] as const,

  details: () => [...passKeys.all, "detail"] as const,
  detail: (id: number) => [...passKeys.details(), id] as const,

  infinites: () => [...passKeys.lists(), "infinite"] as const,
  infinite: (params: FetchPassesParams) =>
    [...passKeys.infinites(), params] as const,

  searches: () => [...passKeys.lists(), "search"] as const,
  search: (params: SearchPassesParams) =>
    [...passKeys.searches(), params] as const,
} as const;

// ----------------------------------------------------------------------------

// Used in store/buyables/pass
export const fetchPassesAPI = createAPI<
  PaginatedResponse<Pass>,
  FetchPassesParams
>((params) => [`${PASS_API_URL}/${buildUrlParams(params)}`]);

export const passesQueryOptions = createQueryOptions<
  PaginatedResponse<Pass>,
  FetchPassesParams
>(
  (params) => [`${PASS_API_URL}/${buildUrlParams(params)}`],
  (params) => passKeys.list(params),
);

export const fetchPassesInfiniteQueryOptions = createInfiniteQueryOptions<
  PaginatedResponse<Pass>,
  FetchPassesParams
>(
  (params) => [`${PASS_API_URL}/${buildUrlParams(params)}`],
  (params) => passKeys.infinite(params),
);

// ----------------------------------------------------------------------------

/**
 * @todo Clean this dirty code that does not type properly search returns
 */
export const passesInfiniteQueryOptions = (
  fetch: Fetch<PaginatedResponse<Pass>>,
  params: FetchPassesParams | SearchPassesParams,
) => {
  const fetchPage = (pageParam: number) =>
    fetchPassesAPI(fetch, { ...params, page: pageParam });

  const fetchSearchPage = (pageParam: number) =>
    fetchPassesSearchAPI(fetch, {
      ...params,
      q: "q" in params ? params.q : "",
      page: pageParam,
    });

  return infiniteQueryOptions({
    queryKey: passKeys.infinite(params),
    queryFn: ({ pageParam }) =>
      "q" in params ? fetchSearchPage(pageParam) : fetchPage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    staleTime: 2 * 60 * 1_000,
  });
};

const fetchPassesSearchAPI = async (
  fetch: Fetch<PaginatedResponse<Pass>>,
  params: FetchPassesParams & { q: string },
): Promise<PaginatedResponse<Pass>> => {
  const [uri, init]: ApiConfig = [
    `${PASS_API_URL}/search/${buildUrlParams(params)}`,
  ];
  const { data } = await fetch(uri, init);
  return data;
};

// ----------------------------------------------------------------------------

// Used in store/buyables/pass
export const searchPassesAPI = createAPI<
  SearchResponse<Pass>,
  SearchPassesParams
>((params) => [`${PASS_API_URL}/search/${buildUrlParams(params ?? {})}`]);

export const searchPassesQueryOptions = createQueryOptions<
  SearchResponse<Pass>,
  SearchPassesParams
>(
  (params) => [`${PASS_API_URL}/search/${buildUrlParams(params ?? {})}`],
  (params) => passKeys.search(params),
);

// ----------------------------------------------------------------------------

export const retrievePassQueryOptions = createQueryOptions<Pass, number>(
  (id) => [`${PASS_API_URL}/${id}/`],
  (id) => passKeys.detail(id),
);
