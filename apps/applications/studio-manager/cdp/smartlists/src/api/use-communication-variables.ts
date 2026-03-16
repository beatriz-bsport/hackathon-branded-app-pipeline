import { useQuery } from "@tanstack/react-query";

import { communicationVariablesQueryOptions } from "@bsport/api-cdp/notification-rule";

import { fetch } from "#src/utils/fetch";

const queryOptions = communicationVariablesQueryOptions(fetch);

export function useCommunicationVariables() {
  const { data } = useQuery(queryOptions);

  return {
    communicationVariables: data ?? {},
  };
}
