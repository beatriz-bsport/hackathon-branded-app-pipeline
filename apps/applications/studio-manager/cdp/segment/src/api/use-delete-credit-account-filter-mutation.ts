import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCreditAccountFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteCreditAccountFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist credit account filter row and invalidates `get_filters` cache.
 */
export const useDeleteCreditAccountFilterMutation = (
  smartlistId: string,
  params: UseDeleteCreditAccountFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) =>
      deleteCreditAccountFilter(fetch, filterId),
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
    deleteCreditAccountFilterMutate: mutation.mutate,
    deleteCreditAccountFilter: mutation.mutateAsync,
  };
};
