import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteBasketAbandonmentFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteBasketAbandonmentFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist abandoned basket filter and invalidates `get_filters` cache.
 */
export const useDeleteBasketAbandonmentFilterMutation = (
  smartlistId: string,
  params: UseDeleteBasketAbandonmentFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (filterId: number) => {
      await deleteBasketAbandonmentFilter(fetch, filterId);
    },
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
    deleteBasketAbandonmentFilterMutate: mutation.mutate,
    deleteBasketAbandonmentFilter: mutation.mutateAsync,
  };
};
