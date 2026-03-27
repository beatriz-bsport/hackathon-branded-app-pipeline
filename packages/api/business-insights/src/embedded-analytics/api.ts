import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch, buildUrlParams } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";

import { API_V1_URL_EMBEDDED_ANALYTICS } from "./constants";
import type { FetchPresignedUrlParams, PresignedUrlResponse } from "./types";

// ----------------------------------------------------------------------------

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "embedded-analytics"] as const,

  presignedUrls: () => [...queryKeys.all, "presigned-url"] as const,

  presignedUrl: ({ dashboardType, language }: FetchPresignedUrlParams) =>
    [...queryKeys.presignedUrls(), language, dashboardType] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchPresignedUrlAPIConfig = (
  params: FetchPresignedUrlParams,
): ApiConfig => {
  return [
    `${API_V1_URL_EMBEDDED_ANALYTICS}/presigned_url/${buildUrlParams({ dashboard_type: params.dashboardType })}`,
  ];
};

const fetchPresignedUrlAPI = async (
  fetch: Fetch<PresignedUrlResponse>,
  params: FetchPresignedUrlParams,
): Promise<PresignedUrlResponse> => {
  const [uri, init] = fetchPresignedUrlAPIConfig(params);

  const { data } = await fetch(uri, init);

  return data;
};

export const fetchPresignedUrlQueryOptions = (
  fetch: Fetch<PresignedUrlResponse>,
  params: FetchPresignedUrlParams,
) =>
  queryOptions({
    queryKey: queryKeys.presignedUrl(params),
    queryFn: () => fetchPresignedUrlAPI(fetch, params),
  });
