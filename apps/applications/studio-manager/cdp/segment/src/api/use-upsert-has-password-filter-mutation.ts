import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type HasPasswordFilter,
  upsertHasPasswordFilterMutationOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertHasPasswordFilterMutationParams = {
  onSuccess?: (data: HasPasswordFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist has password filter and invalidates `get_filters` cache.
 */
export const useUpsertHasPasswordFilterMutation = (
  smartlistId: string,
  params: UseUpsertHasPasswordFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertHasPasswordFilterMutationOptions(fetch),
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
    upsertHasPasswordFilterMutate: mutation.mutate,
    upsertHasPasswordFilter: mutation.mutateAsync,
  };
};
