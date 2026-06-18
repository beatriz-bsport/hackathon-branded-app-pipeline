import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertReferrerFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertReferrerFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a referrer filter and invalidates `get_filters` cache.
 */
export const useUpsertReferrerFilterMutation = (
  smartlistId: string,
  params: UseUpsertReferrerFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertReferrerFilterMutationOptions(fetch),
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
    upsertReferrerFilterMutate: mutation.mutate,
    upsertReferrerFilter: mutation.mutateAsync,
  };
};
