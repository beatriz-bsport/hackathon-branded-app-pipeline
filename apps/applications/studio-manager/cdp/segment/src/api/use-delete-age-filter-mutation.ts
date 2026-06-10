import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteAgeFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteAgeFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist age filter row and invalidates `get_filters` cache.
 */
export const useDeleteAgeFilterMutation = (
  smartlistId: string,
  params: UseDeleteAgeFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteAgeFilter(fetch, filterId),
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
    deleteAgeFilterMutate: mutation.mutate,
    deleteAgeFilter: mutation.mutateAsync,
  };
};
