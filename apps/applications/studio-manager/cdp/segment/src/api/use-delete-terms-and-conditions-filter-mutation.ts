import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTermsAndConditionsFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteTermsAndConditionsFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a terms and conditions filter and invalidates `get_filters` cache.
 */
export const useDeleteTermsAndConditionsFilterMutation = (
  smartlistId: string,
  params: UseDeleteTermsAndConditionsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteTermsAndConditionsFilterMutationOptions(fetch),
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
    deleteTermsAndConditionsFilterMutate: mutation.mutate,
    deleteTermsAndConditionsFilter: mutation.mutateAsync,
  };
};
