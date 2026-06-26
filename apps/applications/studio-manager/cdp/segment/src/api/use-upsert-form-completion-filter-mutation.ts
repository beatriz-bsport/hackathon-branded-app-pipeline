import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertCustomFormFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertFormCompletionFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a custom form completion filter and invalidates `get_filters` cache.
 */
export const useUpsertFormCompletionFilterMutation = (
  smartlistId: string,
  params: UseUpsertFormCompletionFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertCustomFormFilterMutationOptions(fetch),
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
    upsertFormCompletionFilterMutate: mutation.mutate,
    upsertFormCompletionFilter: mutation.mutateAsync,
  };
};
