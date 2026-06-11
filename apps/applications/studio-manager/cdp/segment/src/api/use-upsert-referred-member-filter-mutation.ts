import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreateReferredMemberFilterPayload,
  type UpdateReferredMemberFilterPayload,
  createReferredMemberFilter,
  patchReferredMemberFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertReferredMemberFilterVariables = {
  filterId?: number;
  createPayload?: CreateReferredMemberFilterPayload;
  updatePayload?: UpdateReferredMemberFilterPayload;
};

type UseUpsertReferredMemberFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Creates or partially updates a smartlist referred member filter and invalidates `get_filters` cache.
 */
export const useUpsertReferredMemberFilterMutation = (
  smartlistId: string,
  params: UseUpsertReferredMemberFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertReferredMemberFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create referred member filter.");
        }
        return createReferredMemberFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update referred member filter.");
      }

      return patchReferredMemberFilter(fetch, filterId, updatePayload);
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
    upsertReferredMemberFilterMutate: mutation.mutate,
    upsertReferredMemberFilter: mutation.mutateAsync,
  };
};
