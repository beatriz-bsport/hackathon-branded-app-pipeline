import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteReferrerFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteReferrerFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a referrer filter and invalidates `get_filters` cache.
 */
export const useDeleteReferrerFilterMutation = (
  smartlistId: string,
  params: UseDeleteReferrerFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteReferrerFilterMutationOptions(fetch),
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
    deleteReferrerFilterMutate: mutation.mutate,
    deleteReferrerFilter: mutation.mutateAsync,
  };
};
