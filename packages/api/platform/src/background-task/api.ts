import { Query, QueryClient, queryOptions } from "@tanstack/react-query";

import type { ApiConfig, Fetch } from "@bsport/store-base";

import { API_V1_URL, QUERY_KEY_MAIN } from "#src/constants";

import type { BackgroundTask, BackgroundTaskQueryData } from "./types";
import {
  type DetailQueryMeta,
  getPollingState,
  isDetailQueryMeta,
} from "./utils";

// ----------------------------------------------------------------------------

const API_URL_BACKGROUND_TASK = `${API_V1_URL}/background_task`;

export const queryKeys = {
  all: [QUERY_KEY_MAIN, "background-task"] as const,

  details: () => [...queryKeys.all, "detail"] as const,
  detail: (uuid?: string | null) => [...queryKeys.details(), uuid] as const,
} as const;

// ----------------------------------------------------------------------------

const RETRY_DELAY = 3000;
const RETRY_COUNT = 3;

const fetchBackgroundTaskAPIConfig = ({
  uuid,
}: {
  uuid: string;
}): ApiConfig => {
  return [`${API_URL_BACKGROUND_TASK}/${uuid}/`];
};

export const fetchBackgroundTaskAPI = async <T = unknown>(
  fetch: Fetch<BackgroundTask<T>>,
  uuid: string,
): Promise<BackgroundTask<T>> => {
  const [uri, init] = fetchBackgroundTaskAPIConfig({ uuid });
  const { data } = await fetch(uri, init);
  return data;
};

/**
 * @param queryClient Query Client instance (required to retrieve internal state)
 * @param fetch Fetch instance
 * @param params.uuid UUID of the background task to fetch
 * @param params.maxRefetchDuration [Optional] If provided, number in seconds after which to cancel the refetch polling logic
 * and state the request as a timeout
 */
export const fetchBackgroundTaskQueryOptions = <
  ReturnValueSuccess = unknown,
  ReturnValueFailure = unknown,
>(
  queryClient: QueryClient,
  fetch: Fetch<BackgroundTask<ReturnValueSuccess | ReturnValueFailure>>,
  {
    maxRefetchDuration,
    uuid,
  }: { uuid: string; maxRefetchDuration?: number | null },
) => {
  return queryOptions({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: queryKeys.detail(uuid),
    enabled: Boolean(uuid),
    queryFn: async (): Promise<
      BackgroundTaskQueryData<ReturnValueSuccess, ReturnValueFailure>
    > => {
      const queryKey = queryKeys.detail(uuid);

      // Retrieve refetchCount from query state
      const query = queryClient.getQueryState(queryKey);
      const refetchCount = Math.max(0, query?.dataUpdateCount ?? 0);

      // Use a stable startTime anchored to the first fetch of this uuid
      const cachedMeta = queryClient.getQueryCache().find({ queryKey })?.meta;
      const now = Date.now();
      const startTime =
        isDetailQueryMeta(cachedMeta) && cachedMeta.startTime != null
          ? cachedMeta.startTime
          : now;
      if (startTime === now) {
        queryClient.setQueryDefaults(queryKey, {
          meta: {
            startTime,
          } satisfies DetailQueryMeta,
        });
      }
      // Hit endpoint
      const task = await fetchBackgroundTaskAPI(fetch, uuid);

      // Infer polling state
      const polling = getPollingState({
        task,
        startTime,
        maxRefetchDuration,
        refetchCount,
      });
      return { task, polling };
    },
    refetchIntervalInBackground: true, // Make sure the polling continues even when the user is on another tab
    refetchInterval: (
      query: Query<
        BackgroundTaskQueryData<ReturnValueSuccess, ReturnValueFailure>
      >,
    ) => {
      const polling = query.state.data?.polling;
      if (!polling?.active) {
        return false;
      }
      return polling.nextDelay;
    },
    retry: RETRY_COUNT, // Retry failed requests 3 times
    retryDelay: RETRY_DELAY, // 3 seconds between retries
  });
};
