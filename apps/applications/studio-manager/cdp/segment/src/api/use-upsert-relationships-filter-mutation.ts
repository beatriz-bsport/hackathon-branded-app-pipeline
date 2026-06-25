import { useMutation, useQueryClient } from "@tanstack/react-query";

import { upsertRelationsFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseUpsertRelationshipsFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a relationships filter and invalidates `get_filters` cache.
 */
export const useUpsertRelationshipsFilterMutation = (
  smartlistId: string,
  params: UseUpsertRelationshipsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...upsertRelationsFilterMutationOptions(fetch),
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
    upsertRelationshipsFilterMutate: mutation.mutate,
    upsertRelationshipsFilter: mutation.mutateAsync,
  };
};
