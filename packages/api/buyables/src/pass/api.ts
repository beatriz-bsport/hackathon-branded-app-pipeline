import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type PaginatedResponse,
  buildUrlParams,
} from "@bsport/store-base";

import { API_V1_URL } from "#src/constants";

import type { FetchPassesParams, Pass } from "./types";

const PASS_API_URL = `${API_V1_URL}/payment-pack`;

const PASS_STALE_TIME = 2 * 60 * 1000; // 5 minutes

export const passKeys = {
  all: ["@api-buyables", "pass"] as const,
  list: (params: FetchPassesParams) =>
    [...passKeys.all, "list", params] as const,
} as const;

const fetchPassesAPIConfig = (params: FetchPassesParams): ApiConfig => {
  return [`${PASS_API_URL}/${buildUrlParams(params)}`];
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
) =>
  queryOptions({
    queryKey: passKeys.list(params),
    queryFn: () => fetchPassesAPI(fetch, params),
    staleTime: PASS_STALE_TIME,
  });
