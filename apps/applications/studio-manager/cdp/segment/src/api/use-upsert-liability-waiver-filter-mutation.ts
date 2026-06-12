import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type LiabilityWaiverFilter,
  upsertLiabilityWaiverFilterMutationOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertLiabilityWaiverFilterMutationParams = {
  onSuccess?: (data: LiabilityWaiverFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a liability waiver filter and invalidates `get_filters` cache.
 */
export const useUpsertLiabilityWaiverFilterMutation = (
  smartlistId: string,
  params: UseUpsertLiabilityWaiverFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertLiabilityWaiverFilterMutationOptions(fetch),
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
    upsertLiabilityWaiverFilterMutate: mutation.mutate,
    upsertLiabilityWaiverFilter: mutation.mutateAsync,
  };
};
