import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  aiSummaryTaskIdQueryOptions,
  queryKeys,
} from "@bsport/api-business-insights/ai-summary";
import type { AiSummaryResult } from "@bsport/api-business-insights/ai-summary";
import { fetchBackgroundTaskAction } from "@bsport/store-shared-background-task";

import { fetch } from "#src/utils/fetch";
import { useTranslation } from "#src/utils/i18n";

export type {
  AiSummaryContent,
  AiSummaryResult,
} from "@bsport/api-business-insights/ai-summary";

// Sigma data refreshes every 1h — no point caching the summary longer than that
const TASK_UUID_CACHE_MS = 60 * 60 * 1000; // 1h
const RESULT_CACHE_MS = 60 * 60 * 1000; // 1h

interface UseGenerateSummaryParams {
  insightKey: string;
  elementIds: string[];
  controls?: Record<string, string>;
  enabled?: boolean;
}

export const useGenerateSummary = ({
  insightKey,
  elementIds,
  controls,
  enabled = false,
}: UseGenerateSummaryParams) => {
  const { t } = useTranslation("insights");
  const queryClient = useQueryClient();

  const taskIdOpts = aiSummaryTaskIdQueryOptions(fetch, {
    insightKey,
    elementIds,
    controls,
  });

  const {
    data: backgroundTaskUuid,
    error: uuidError,
    isFetching: isFetchingUuid,
  } = useQuery({
    ...taskIdOpts,
    enabled,
    retry: false,
    retryOnMount: true, // retries on next panel open instead of showing stale error
    staleTime: TASK_UUID_CACHE_MS,
    gcTime: TASK_UUID_CACHE_MS,
    refetchOnWindowFocus: false,
  });

  const resultOpts = queryOptions({
    queryKey: queryKeys.result(backgroundTaskUuid ?? ""),
    queryFn: () =>
      new Promise<AiSummaryResult>((resolve, reject) => {
        fetchBackgroundTaskAction<AiSummaryResult>(
          fetch as Parameters<typeof fetchBackgroundTaskAction>[0],
          {
            uuid: backgroundTaskUuid!,
            callbacks: {
              onSuccess: (task) =>
                resolve(task.return_value as AiSummaryResult),
              onTaskFailure: () => reject(new Error("generateSummaryFailed")),
              onEndpointFailure: () =>
                reject(new Error("generateSummaryFailed")),
              onTimeout: () => reject(new Error("generateSummaryTimeout")),
            },
          },
        ).catch(() => reject(new Error("generateSummaryFailed")));
      }),
  });

  const {
    data,
    error: resultError,
    isFetching: isFetchingResult,
  } = useQuery({
    ...resultOpts,
    enabled: enabled && !!backgroundTaskUuid,
    retry: false,
    retryOnMount: true,
    staleTime: Infinity,
    gcTime: RESULT_CACHE_MS,
    refetchOnWindowFocus: false,
  });

  // On result error: clear both queries — reusing a failed backend task UUID would re-fail
  useEffect(() => {
    if (!resultError) return;
    queryClient.removeQueries({ queryKey: resultOpts.queryKey, exact: true });
    queryClient.removeQueries({ queryKey: taskIdOpts.queryKey, exact: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultError]);

  const error = uuidError ?? resultError;

  return {
    data,
    isLoading: isFetchingUuid || isFetchingResult,
    error: error
      ? t(
          (error as Error).message === "generateSummaryTimeout"
            ? "errors.generateSummaryTimeout"
            : "errors.generateSummaryFailed",
        )
      : null,
  };
};
