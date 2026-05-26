import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTagFilter } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteTagFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a smartlist tag filter row and invalidates `get_filters` cache.
 */
export const useDeleteTagFilterMutation = (
  smartlistId: string,
  params: UseDeleteTagFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (filterId: number) => deleteTagFilter(fetch, filterId),
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
    deleteTagFilterMutate: mutation.mutate,
    deleteTagFilter: mutation.mutateAsync,
  };
};
