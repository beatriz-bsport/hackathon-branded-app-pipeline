import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMarketingNotificationFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteMarketingNotificationFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteMarketingNotificationFilterMutation = (
  smartlistId: string,
  params: UseDeleteMarketingNotificationFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteMarketingNotificationFilter(fetch, filterId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      params.onSuccess?.();
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    deleteMarketingNotificationFilterMutate: mutation.mutate,
    deleteMarketingNotificationFilter: mutation.mutateAsync,
  };
};
