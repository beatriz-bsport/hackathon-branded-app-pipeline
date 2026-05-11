import { useQuery } from "@tanstack/react-query";

import { communicationVariablesQueryOptions } from "@bsport/api-cdp/notification-rule";

import { fetch } from "#src/utils/fetch";

const queryOptions = communicationVariablesQueryOptions(fetch);

const STALE_TIME = 2 * 60 * 1000; // 2 minutes

export function useCommunicationVariables() {
  const { data } = useQuery({ ...queryOptions, staleTime: STALE_TIME });

  return {
    communicationVariables: data ?? {},
  };
}
