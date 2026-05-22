import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createGenderFilter,
  patchGenderFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  GenderFilterCreatePayload,
  GenderFilterDirtyPatchPayload,
} from "#src/components/filters/gender-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertGenderFilterVariables = {
  filterId?: number;
  createPayload?: GenderFilterCreatePayload;
  updatePayload?: GenderFilterDirtyPatchPayload;
};

type UseUpsertGenderFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpsertGenderFilterMutation = (
  smartlistId: string,
  params: UseUpsertGenderFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertGenderFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create gender filter.");
        }
        return createGenderFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update gender filter.");
      }

      return patchGenderFilter(fetch, filterId, updatePayload);
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
    upsertGenderFilterMutate: mutation.mutate,
    upsertGenderFilter: mutation.mutateAsync,
  };
};
