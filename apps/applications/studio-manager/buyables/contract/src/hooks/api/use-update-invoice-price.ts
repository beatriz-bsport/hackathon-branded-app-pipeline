import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  type UpdateInvoicePriceParams,
  queryKeys,
  updateInvoicePriceMutationOptions,
} from "@bsport/api-buyables/billing-plan-planned-invoice";
import { HTTPException } from "@bsport/fetch";

import { fetch } from "#src/utils/fetch";

type Callbacks = {
  onSuccess?: (data: UpdateInvoicePriceParams) => void;
  onError?: (error: HTTPException | Error) => void;
};

export const useUpdateInvoicePriceMutation = ({
  onSuccess,
  onError,
}: Callbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...updateInvoicePriceMutationOptions(fetch),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listByPlan(data.billingPlanId),
      });

      onSuccess?.(data);
    },
    onError: (error) => {
      console.error(error);
      onError?.(error);
    },
  });
};
