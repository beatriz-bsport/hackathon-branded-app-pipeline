import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_INVOICE,
  requestPaymentClientSecretAPI,
} from "@bsport/api-financial-services";
import type { Fetch } from "@bsport/fetch";

type UseRequestPaymentClientSecretParams = {
  fetch: Fetch;
  invoiceId: string;
  memberId: number;
  enabled: boolean;
};

const requestPaymentClientSecretQueryOptions = ({
  fetch,
  invoiceId,
  memberId,
  enabled,
}: UseRequestPaymentClientSecretParams) => {
  const requestPaymentClientSecret = requestPaymentClientSecretAPI.bind(
    null,
    fetch,
  );

  return queryOptions({
    queryKey: [
      "payment-flow-modal",
      "client-secret",
      {
        invoiceId,
        memberId,
        paymentEngine: PAYMENT_ENGINE_STRIPE,
      },
    ],
    queryFn: () =>
      requestPaymentClientSecret({
        payment_engine_identifier: PAYMENT_ENGINE_STRIPE,
        payment_intent_type: PAYMENT_INTENT_TYPE_INVOICE,
        invoice: invoiceId,
        member: memberId,
      }),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: enabled && invoiceId.length > 0 && memberId > 0,
  });
};

export const useRequestPaymentClientSecret = (
  params: UseRequestPaymentClientSecretParams,
) =>
  useQuery({
    ...requestPaymentClientSecretQueryOptions(params),
  });
