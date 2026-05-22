import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateTagFilterPayload,
  type UpdateTagFilterPayload,
  createTagFilter,
  patchTagFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertTagFilterVariables = {
  filterId?: number;
  createPayload?: CreateTagFilterPayload;
  updatePayload?: UpdateTagFilterPayload;
};

type UseUpsertTagFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist tag filter and invalidates `get_filters` cache.
 */
export const useUpsertTagFilterMutation = (
  smartlistId: string,
  params: UseUpsertTagFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertTagFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create tag filter.");
        }
        return createTagFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update tag filter.");
      }

      return patchTagFilter(fetch, filterId, updatePayload);
    },
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
    upsertTagFilterMutate: mutation.mutate,
    upsertTagFilter: mutation.mutateAsync,
  };
};
