import { queryOptions } from "@tanstack/react-query";

import { type ApiConfig, type Fetch } from "@bsport/store-base";

import { QUERY_KEY_MAIN } from "#src/constants";
import { API_V1_URL_EMBEDDED_ANALYTICS } from "#src/embedded-analytics/constants";

import type { FetchAiSummaryParams } from "./types";

// ----------------------------------------------------------------------------

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "ai-summary"] as const,

  taskIds: () => [...queryKeys.all, "task-id"] as const,

  taskId: (params: FetchAiSummaryParams) =>
    [...queryKeys.taskIds(), params] as const,

  results: () => [...queryKeys.all, "result"] as const,

  result: (backgroundTaskUuid: string) =>
    [...queryKeys.results(), backgroundTaskUuid] as const,
} as const;

// ----------------------------------------------------------------------------

interface GenerateSummaryRequestBody {
  element_ids: string[];
  controls?: Record<string, string>;
}

const fetchAiSummaryTaskIdAPIConfig = ({
  insightKey,
  elementIds,
  controls,
}: FetchAiSummaryParams): ApiConfig => {
  const url = `${API_V1_URL_EMBEDDED_ANALYTICS}/generate_summary/${insightKey}/`;
  const body: GenerateSummaryRequestBody = { element_ids: elementIds };
  if (controls && Object.keys(controls).length > 0) body.controls = controls;
  return [url, { method: "POST", body: JSON.stringify(body) }];
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
