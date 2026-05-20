import { queryOptions } from "@tanstack/react-query";

import {
  type ApiConfig,
  type Fetch,
  type URLParams,
  buildUrlParams,
} from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";
import { API_V1_URL_EMBEDDED_ANALYTICS } from "#src/embedded-analytics/constants";

import type { FetchAiSummaryParams } from "./types";

// ----------------------------------------------------------------------------

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "ai-summary"] as const,

  taskIds: () => [...queryKeys.all, "task-id"] as const,

  taskId: ({ insightKey, variables, pageId }: FetchAiSummaryParams) =>
    [
      ...queryKeys.taskIds(),
      insightKey,
      variables ?? {},
      pageId ?? null,
    ] as const,

  results: () => [...queryKeys.all, "result"] as const,

  result: (backgroundTaskUuid: string) =>
    [...queryKeys.results(), backgroundTaskUuid] as const,
} as const;

// ----------------------------------------------------------------------------

const fetchAiSummaryTaskIdAPIConfig = ({
  insightKey,
  variables,
  pageId,
}: FetchAiSummaryParams): ApiConfig => {
  const base = `${API_V1_URL_EMBEDDED_ANALYTICS}/generate_summary/${insightKey}/`;
  const rawParams: URLParams = {
    ...(pageId && { page_id: pageId }),
    ...(variables &&
      Object.keys(variables).length > 0 && {
        controls: JSON.stringify(variables),
      }),
  };
  const query =
    Object.keys(rawParams).length > 0 ? buildUrlParams(rawParams) : "";
  return [`${base}${query}`];
};

export const fetchAiSummaryTaskIdAPI = async (
  fetch: Fetch<unknown>,
  params: FetchAiSummaryParams,
): Promise<string> => {
  const [uri, init] = fetchAiSummaryTaskIdAPIConfig(params);
  const { backgroundTaskUuid } = await fetch(uri, init);
  if (!backgroundTaskUuid) throw new Error("generateSummaryFailed");
  return backgroundTaskUuid;
};

export const aiSummaryTaskIdQueryOptions = (
  fetch: Fetch<unknown>,
  params: FetchAiSummaryParams,
) =>
  queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- fetch is a stable module-level singleton
    queryKey: queryKeys.taskId(params),
    queryFn: () => fetchAiSummaryTaskIdAPI(fetch, params),
  });
