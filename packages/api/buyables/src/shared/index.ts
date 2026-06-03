import { mutationOptions, queryOptions } from "@tanstack/react-query";

import type { ApiConfig, Fetch, Xhr, XhrApiConfig } from "@bsport/store-base";

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
