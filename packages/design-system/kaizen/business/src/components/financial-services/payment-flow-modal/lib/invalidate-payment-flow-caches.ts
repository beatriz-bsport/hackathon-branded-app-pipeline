import type { QueryClient } from "@tanstack/react-query";

import { memberKeys } from "@bsport/api-cdp/member";
import { invoiceKeys } from "@bsport/api-financial-services/invoice";
import { paymentGroupKeys } from "@bsport/api-financial-services/payment-group";
import { paymentMethodKeys } from "@bsport/api-financial-services/payment-method";

export type PaymentFlowCacheScope = {
  invoiceId: string;
  memberId: number;
};

/**
 * Refreshes payment-flow caches after the modal has closed.
 * Drops the invoice detail entry so the next open always refetches amount due.
 */
export const invalidatePaymentFlowCaches = (
  queryClient: QueryClient,
  { invoiceId, memberId }: PaymentFlowCacheScope,
) => {
  queryClient.removeQueries({ queryKey: invoiceKeys.detail(invoiceId) });

  return Promise.all([
    queryClient.invalidateQueries({ queryKey: paymentGroupKeys.all }),
    queryClient.invalidateQueries({
      queryKey: paymentMethodKeys.saved(memberId),
    }),
    queryClient.invalidateQueries({ queryKey: memberKeys.detail(memberId) }),
  ]);
};
