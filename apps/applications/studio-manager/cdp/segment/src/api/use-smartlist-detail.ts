import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { smartlistDetailQueryOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

export const useSmartlistDetailSuspenseQuery = (id: string) => {
  return useSuspenseQuery(smartlistDetailQueryOptions(fetch, id));
};

export const usePrefetchSmartlistDetail = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery(smartlistDetailQueryOptions(fetch, id));
  };
};
