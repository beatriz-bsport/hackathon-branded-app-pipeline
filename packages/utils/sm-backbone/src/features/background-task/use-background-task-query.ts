import { useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchBackgroundTaskQueryOptions } from "@bsport/api-platform/background-task";
import { Fetch } from "@bsport/fetch";

export type UseBackgroundTaskQueryParams = {
  fetch: Fetch;
  uuid?: string | null;
  // Duration in seconds after which the refetch polling is cancelled (timeout)
  maxRefetchDuration?: number;
};

export function useBackgroundTaskQuery<
  BackgroundTaskValueSuccess = unknown,
  BackgroundTaskValueError = unknown,
>({ fetch, uuid, maxRefetchDuration }: UseBackgroundTaskQueryParams) {
  const queryClient = useQueryClient();

  return useQuery({
    ...fetchBackgroundTaskQueryOptions<
      BackgroundTaskValueSuccess,
      BackgroundTaskValueError
    >(queryClient, fetch, {
      uuid: uuid!,
      maxRefetchDuration,
    }),
    enabled: Boolean(uuid),
  });
}
