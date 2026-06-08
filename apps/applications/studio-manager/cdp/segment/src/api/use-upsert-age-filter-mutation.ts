import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAgeFilter, patchAgeFilter } from "@bsport/api-cdp/smartlist";

import type {
  AgeFilterCreatePayload,
  AgeFilterDirtyPatchPayload,
} from "#src/components/filters/age-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertAgeFilterVariables = {
  filterId?: number;
  createPayload?: AgeFilterCreatePayload;
  updatePayload?: AgeFilterDirtyPatchPayload;
};

type UseUpsertAgeFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpsertAgeFilterMutation = (
  smartlistId: string,
  params: UseUpsertAgeFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertAgeFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create age filter.");
        }
        return createAgeFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update age filter.");
      }

      return patchAgeFilter(fetch, filterId, updatePayload);
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
    upsertAgeFilterMutate: mutation.mutate,
    upsertAgeFilter: mutation.mutateAsync,
  };
};
