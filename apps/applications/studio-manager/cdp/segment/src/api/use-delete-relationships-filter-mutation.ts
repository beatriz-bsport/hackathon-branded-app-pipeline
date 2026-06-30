import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteRelationsFilterMutationOptions } from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UseDeleteRelationshipsFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Deletes a relationships filter and invalidates `get_filters` cache.
 */
export const useDeleteRelationshipsFilterMutation = (
  smartlistId: string,
  params: UseDeleteRelationshipsFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    ...deleteRelationsFilterMutationOptions(fetch),
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
    deleteRelationshipsFilterMutate: mutation.mutate,
    deleteRelationshipsFilter: mutation.mutateAsync,
  };
};
