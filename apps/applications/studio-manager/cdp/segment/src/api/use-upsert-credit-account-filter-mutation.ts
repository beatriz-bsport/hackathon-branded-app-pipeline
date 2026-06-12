import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreditAccountFilter,
  createCreditAccountFilter,
  patchCreditAccountFilter,
} from "@bsport/api-cdp/smartlist";

import type {
  CreditAccountFilterCreatePayload,
  CreditAccountFilterDirtyPatchPayload,
} from "#src/components/filters/credit-account/types";
import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertCreditAccountFilterVariables = {
  filterId?: number;
  createPayload?: CreditAccountFilterCreatePayload;
  updatePayload?: CreditAccountFilterDirtyPatchPayload;
};

type UseUpsertCreditAccountFilterMutationParams = {
  onSuccess?: (data: CreditAccountFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertCreditAccountFilterMutation = (
  smartlistId: string,
  params: UseUpsertCreditAccountFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertCreditAccountFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create credit account filter.");
        }
        return createCreditAccountFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update credit account filter.");
      }

      return patchCreditAccountFilter(fetch, filterId, updatePayload);
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
    upsertCreditAccountFilterMutate: mutation.mutate,
    upsertCreditAccountFilter: mutation.mutateAsync,
  };
};
