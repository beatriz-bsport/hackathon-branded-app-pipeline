import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { smartlistDetailQueryOptions } from "./api";

export const useSmartlistDetailSuspenseQuery = (id: string) => {
  return useSuspenseQuery(smartlistDetailQueryOptions(id));
};

export const usePrefetchSmartlistDetail = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery(smartlistDetailQueryOptions(id));
  };
};
