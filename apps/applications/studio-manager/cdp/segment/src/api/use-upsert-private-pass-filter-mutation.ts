import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreatePrivatePassFilterPayload,
  type PrivatePassFilter,
  type UpdatePrivatePassFilterPayload,
  createPrivatePassFilter,
  patchPrivatePassFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertPrivatePassFilterVariables = {
  filterId?: number;
  createPayload?: CreatePrivatePassFilterPayload;
  updatePayload?: UpdatePrivatePassFilterPayload;
};

type UseUpsertPrivatePassFilterMutationParams = {
  onSuccess?: (data: PrivatePassFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertPrivatePassFilterMutation = (
  smartlistId: string,
  params: UseUpsertPrivatePassFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertPrivatePassFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create private pass filter.");
        }
        return createPrivatePassFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update private pass filter.");
      }

      return patchPrivatePassFilter(fetch, filterId, updatePayload);
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
    upsertPrivatePassFilterMutate: mutation.mutate,
    upsertPrivatePassFilter: mutation.mutateAsync,
  };
};
