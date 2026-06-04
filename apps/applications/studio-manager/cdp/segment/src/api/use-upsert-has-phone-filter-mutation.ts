import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createHasPhoneFilter,
  patchHasPhoneFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  HasPhoneFilterCreatePayload,
  HasPhoneFilterDirtyPatchPayload,
} from "#src/components/filters/has-phone-filter/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertHasPhoneFilterVariables = {
  filterId?: number;
  createPayload?: HasPhoneFilterCreatePayload;
  updatePayload?: HasPhoneFilterDirtyPatchPayload;
};

type UseUpsertHasPhoneFilterMutationParams = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpsertHasPhoneFilterMutation = (
  smartlistId: string,
  params: UseUpsertHasPhoneFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertHasPhoneFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create has phone filter.");
        }
        return createHasPhoneFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update has phone filter.");
      }

      return patchHasPhoneFilter(fetch, filterId, updatePayload);
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
    upsertHasPhoneFilterMutate: mutation.mutate,
    upsertHasPhoneFilter: mutation.mutateAsync,
  };
};
