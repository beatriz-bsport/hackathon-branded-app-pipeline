import {
  infiniteQueryOptions,
  mutationOptions,
  queryOptions,
} from "@tanstack/react-query";

import type {
  ApiConfig,
  Fetch,
  PaginatedResponse,
  ResponseType,
  Xhr,
  XhrApiConfig,
} from "@bsport/store-base";

type ApiConfigBuilder<Params> = (params: Params) => ApiConfig;

export function createAPI<FetchResult, Params>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
) {
  return async (fetch: Fetch<FetchResult>, params: Params) => {
    const [uri, init] = apiConfigBuilder(params);

    const { data } = await fetch(uri, init);

    return data;
  };
}

export function createQueryOptions<FetchResult, Params>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
  queryKeyGetter: (params: Params) => readonly unknown[],
) {
  return (fetch: Fetch<FetchResult>, params: Params) =>
    queryOptions({
      queryKey: queryKeyGetter(params),
      queryFn: () =>
        createAPI<FetchResult, Params>(apiConfigBuilder)(fetch, params),
    });
}

export function createInfiniteQueryOptions<
  FetchResult extends PaginatedResponse,
  Params,
>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
  queryKeyGetter: (params: Params) => readonly unknown[],
) {
  return (fetch: Fetch<FetchResult>, params: Params) =>
    infiniteQueryOptions({
      queryKey: queryKeyGetter(params),
      queryFn: ({ pageParam }) =>
        createAPI<FetchResult, Params>(apiConfigBuilder)(fetch, {
          ...params,
          page: pageParam,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.next_page ?? undefined,
    });
}

export function createMutationOptions<FetchResult, Params>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
) {
  return (fetch: Fetch<FetchResult>) =>
    mutationOptions({
      mutationFn: (params: Params) =>
        createAPI<FetchResult, Params>(apiConfigBuilder)(fetch, params),
    });
}

// ----------------------------------------------------------------------------

export function createBgTaskAPI<FetchResult, Params>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
) {
  return async (
    fetch: Fetch<FetchResult>,
    params: Params,
  ): Promise<ResponseType<FetchResult>> => {
    const [uri, init] = apiConfigBuilder(params);

    return await fetch(uri, init);
  };
}

export function createBgTaskMutationOptions<FetchResult, Params>(
  apiConfigBuilder: ApiConfigBuilder<Params>,
) {
  return (fetch: Fetch<FetchResult>) =>
    mutationOptions({
      mutationFn: (params: Params) =>
        createBgTaskAPI<FetchResult, Params>(apiConfigBuilder)(fetch, params),
    });
}

// ----------------------------------------------------------------------------

type XhrApiConfigBuilder<Params> = (params: Params) => XhrApiConfig;

export function createXhrAPI<XhrResult, Params>(
  apiConfigBuilder: XhrApiConfigBuilder<Params>,
) {
  return async (fetch: Xhr<XhrResult>, params: Params) => {
    const [uri, init] = apiConfigBuilder(params);

    const { data } = await fetch(uri, init);

    return data;
  };
}
