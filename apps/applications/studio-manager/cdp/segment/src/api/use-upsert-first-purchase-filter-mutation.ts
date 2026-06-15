import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateFirstPurchaseFilterPayload,
  type FirstPurchaseFilter,
  type UpdateFirstPurchaseFilterPayload,
  createFirstPurchaseFilter,
  patchFirstPurchaseFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertFirstPurchaseFilterVariables = {
  filterId?: number;
  createPayload?: CreateFirstPurchaseFilterPayload;
  updatePayload?: UpdateFirstPurchaseFilterPayload;
};

type UseUpsertFirstPurchaseFilterMutationParams = {
  onSuccess?: (data: FirstPurchaseFilter) => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist first purchase filter and invalidates `get_filters` cache.
 */
export const useUpsertFirstPurchaseFilterMutation = (
  smartlistId: string,
  params: UseUpsertFirstPurchaseFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertFirstPurchaseFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create first purchase filter.");
        }
        return createFirstPurchaseFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update first purchase filter.");
      }

      return patchFirstPurchaseFilter(fetch, filterId, updatePayload);
    },
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
    upsertFirstPurchaseFilterMutate: mutation.mutate,
    upsertFirstPurchaseFilter: mutation.mutateAsync,
  };
};
