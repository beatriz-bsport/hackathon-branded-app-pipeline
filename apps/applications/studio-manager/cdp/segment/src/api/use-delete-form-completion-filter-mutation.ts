import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteCustomFormFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteFormCompletionFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a custom form completion filter and invalidates `get_filters` cache.
 */
export const useDeleteFormCompletionFilterMutation = (
  smartlistId: string,
  params: UseDeleteFormCompletionFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteCustomFormFilterMutationOptions(fetch),
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
    deleteFormCompletionFilterMutate: mutation.mutate,
    deleteFormCompletionFilter: mutation.mutateAsync,
  };
};
