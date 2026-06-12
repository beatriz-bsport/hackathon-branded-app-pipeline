import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type CreatePaymentPackFilterPayload,
  type PaymentPackFilter,
  type UpdatePaymentPackFilterPayload,
  createPaymentPackFilter,
  patchPaymentPackFilter,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

import { smartlistQueryKeys } from "./api";

type UpsertPaymentPackFilterVariables = {
  filterId?: number;
  createPayload?: CreatePaymentPackFilterPayload;
  updatePayload?: UpdatePaymentPackFilterPayload;
};

type UseUpsertPaymentPackFilterMutationParams = {
  onSuccess?: (data: PaymentPackFilter) => void;
  onError?: (error: Error) => void;
};

export const useUpsertPaymentPackFilterMutation = (
  smartlistId: string,
  params: UseUpsertPaymentPackFilterMutationParams = {},
) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      filterId,
      createPayload,
      updatePayload,
    }: UpsertPaymentPackFilterVariables) => {
      if (!filterId) {
        if (!createPayload) {
          throw new Error("Missing payload to create payment pack filter.");
        }
        return createPaymentPackFilter(fetch, createPayload);
      }

      if (!updatePayload || Object.keys(updatePayload).length === 0) {
        throw new Error("Missing payload to update payment pack filter.");
      }

      return patchPaymentPackFilter(fetch, filterId, updatePayload);
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
    upsertPaymentPackFilterMutate: mutation.mutate,
    upsertPaymentPackFilter: mutation.mutateAsync,
  };
};
