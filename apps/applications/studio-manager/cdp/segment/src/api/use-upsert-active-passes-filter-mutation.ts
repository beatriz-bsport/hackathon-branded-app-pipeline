import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  CreateActivePassesFilterPayload,
  UpdateActivePassesFilterPayload,
  createActivePassesFilter,
  patchActivePassesFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertActivePassesFilterVariables = {
  filterId?: number;
  createPayload?: CreateActivePassesFilterPayload;
  updatePayload?: UpdateActivePassesFilterPayload;
};

type UseUpsertActivePassesFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Mutation hook for creating or updating an active passes filter.
 * Invalidates the smartlist filters query on success so the filter list re-hydrates.
 */
export const useUpsertActivePassesFilterMutation = (
  smartlistId: string,
  params: UseUpsertActivePassesFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertActivePassesFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create active passes filter.");
        }
        return createActivePassesFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update active passes filter.");
      }

      return patchActivePassesFilter(fetch, filterId, updatePayload);
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
    upsertActivePassesFilterMutate: mutation.mutate,
    upsertActivePassesFilter: mutation.mutateAsync,
  };
};
