import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type TermsAndConditionsFilter,
  upsertTermsAndConditionsFilterMutationOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertTermsAndConditionsFilterMutationParams = {
  onSuccess?: (data: TermsAndConditionsFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a terms and conditions filter and invalidates
 * `get_filters` cache.
 */
export const useUpsertTermsAndConditionsFilterMutation = (
  smartlistId: string,
  params: UseUpsertTermsAndConditionsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertTermsAndConditionsFilterMutationOptions(fetch),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: smartlistQueryKeys.smartlistKeys.filters(smartlistId),
      });
      params.onSuccess?.(data);
    },
    onError: (error) => params.onError?.(error),
  });

  return {
    isLoading: mutation.isPending,
    upsertTermsAndConditionsFilterMutate: mutation.mutate,
    upsertTermsAndConditionsFilter: mutation.mutateAsync,
  };
};
