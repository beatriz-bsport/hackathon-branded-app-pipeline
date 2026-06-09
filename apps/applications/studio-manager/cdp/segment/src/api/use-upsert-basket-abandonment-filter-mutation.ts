import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateBasketAbandonmentFilterPayload,
  type UpdateBasketAbandonmentFilterPayload,
  createBasketAbandonmentFilter,
  patchBasketAbandonmentFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertBasketAbandonmentFilterVariables = {
  filterId?: number;
  createPayload?: CreateBasketAbandonmentFilterPayload;
  updatePayload?: UpdateBasketAbandonmentFilterPayload;
};

type UseUpsertBasketAbandonmentFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist abandoned basket filter and invalidates `get_filters` cache.
 */
export const useUpsertBasketAbandonmentFilterMutation = (
  smartlistId: string,
  params: UseUpsertBasketAbandonmentFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertBasketAbandonmentFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create abandoned basket filter.");
        }
        return createBasketAbandonmentFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update abandoned basket filter.");
      }

      return patchBasketAbandonmentFilter(fetch, filterId, updatePayload);
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
    upsertBasketAbandonmentFilterMutate: mutation.mutate,
    upsertBasketAbandonmentFilter: mutation.mutateAsync,
  };
};
