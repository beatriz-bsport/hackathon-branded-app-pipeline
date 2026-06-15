import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@bsport/api-buyables/billing-plan-planned-invoice";
import { HTTPException } from "@bsport/fetch";

type UpdateInvoiceBillingDateParams = {
  invoiceId: number;
  billingPlanId: number;
  billingDate: string;
};

type Callbacks = {
  onSuccess?: (data: UpdateInvoiceBillingDateParams) => void;
  onError?: (error: HTTPException | Error) => void;
};

export const useUpdateInvoiceBillingDateMutation = ({
  onSuccess,
  onError,
}: Callbacks = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    // TODO: wire PATCH /subscription/planned-invoice/:id/ when available.
    mutationFn: async (
      _params: UpdateInvoiceBillingDateParams,
    ): Promise<UpdateInvoiceBillingDateParams> => {
      throw new Error("Billing date update is not available yet.");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.listByPlan(data.billingPlanId),
      });

      onSuccess?.(data);
    },
    onError: (error) => onError?.(error),
  });
};
