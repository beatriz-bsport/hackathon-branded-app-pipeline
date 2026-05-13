import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import type { FetchPassesParams, Pass } from "./types";

const PASS_API_URL = `${API_V1_URL}/payment-pack`;

const PASS_STALE_TIME = 2 * 60 * 1000; // 2 minutes

export const passKeys = {
  all: ["@api-buyables", "pass"] as const,
  lists: () => [...passKeys.all, "list"] as const,
  list: (params: FetchPassesParams) => [...passKeys.lists(), params] as const,
  infinites: () => [...passKeys.lists(), "infinite"] as const,
  infinite: (params: FetchPassesParams) =>
    [...passKeys.infinites(), params] as const,
} as const;

const fetchPassesAPIConfig = (params: FetchPassesParams): ApiConfig => {
  return [`${PASS_API_URL}/payment-pack/${buildUrlParams(params)}`];
};

export const fetchPassesAPI = async (
  fetch: Fetch<PaginatedResponse<Pass>>,
  params: FetchPassesParams,
): Promise<PaginatedResponse<Pass>> => {
  const [uri, init] = fetchPassesAPIConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const passesQueryOptions = (
  fetch: Fetch<PaginatedResponse<Pass>>,
  params: FetchPassesParams,
) => {
  const queryFn = fetchPassesAPI.bind(null, fetch, params);
  return queryOptions({
    queryKey: passKeys.list(params),
    queryFn,
    staleTime: PASS_STALE_TIME,
  });
};

export const passesInfiniteQueryOptions = (
  fetch: Fetch<PaginatedResponse<Pass>>,
  params: FetchPassesParams,
) => {
  const fetchPasses = fetchPassesAPI.bind(null, fetch);
  return infiniteQueryOptions({
    queryKey: passKeys.infinite(params),
    queryFn: ({ pageParam }) => fetchPasses({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    staleTime: PASS_STALE_TIME,
  });
};
