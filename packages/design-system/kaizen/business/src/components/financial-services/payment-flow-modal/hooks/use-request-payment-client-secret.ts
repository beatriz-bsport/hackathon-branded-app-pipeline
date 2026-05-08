import { queryOptions, useQuery } from "@tanstack/react-query";

import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_INVOICE,
  paymentGroupKeys,
  requestPaymentClientSecretAPI,
} from "@bsport/api-financial-services";
import type { Fetch } from "@bsport/fetch";

type PaymentClientSecretEngine = "stripe" | "manual" | "terminal";

type UseRequestPaymentClientSecretParams = {
  fetch: Fetch;
  invoiceId: string;
  paymentEngine: PaymentClientSecretEngine | null;
  enabled: boolean;
};

const PAYMENT_ENGINE_MANUAL = 0;
const DISABLED_CLIENT_SECRET_INVOICE_SUFFIX = "__disabled_client_secret__";

/**
 * Maps UI payment-engine selections to the request payload expected by backend
 * client-secret generation.
 */
const getPayloadByPaymentEngine = (
  invoiceId: string,
  paymentEngine: PaymentClientSecretEngine,
) => {
  const basePayload = {
    payment_intent_type: PAYMENT_INTENT_TYPE_INVOICE,
    invoice: invoiceId,
  };

  if (paymentEngine === "manual") {
    return {
      ...basePayload,
      payment_engine_identifier: PAYMENT_ENGINE_MANUAL,
    };
  }

  if (paymentEngine === "terminal") {
    return {
      ...basePayload,
      payment_engine_identifier: PAYMENT_ENGINE_STRIPE,
      is_physical_payment_intent: true,
    };
  }

  return {
    ...basePayload,
    payment_engine_identifier: PAYMENT_ENGINE_STRIPE,
  };
};

/**
 * Produces query options for payment client-secret retrieval.
 *
 * When no payment engine is selected, returns a disabled query with a stable
 * placeholder key and empty data shape, which keeps consuming code simple and
 * avoids accidental requests.
 */
const requestPaymentClientSecretQueryOptions = ({
  fetch,
  invoiceId,
  paymentEngine,
  enabled,
}: UseRequestPaymentClientSecretParams) => {
  const requestPaymentClientSecret = requestPaymentClientSecretAPI.bind(
    null,
    fetch,
  );

  if (!paymentEngine) {
    return queryOptions({
      queryKey: paymentGroupKeys.clientSecret({
        payment_engine_identifier: PAYMENT_ENGINE_STRIPE,
        payment_intent_type: PAYMENT_INTENT_TYPE_INVOICE,
        invoice: `${invoiceId}${DISABLED_CLIENT_SECRET_INVOICE_SUFFIX}`,
      }),
      queryFn: async () => ({
        client_secret: "",
        payment_group: 0,
        price_cts: 0,
      }),
      enabled: false,
    });
  }

  const payload = getPayloadByPaymentEngine(invoiceId, paymentEngine);

  return queryOptions({
    queryKey: paymentGroupKeys.clientSecret(payload),
    queryFn: () => requestPaymentClientSecret(payload),
    staleTime: 0,
    gcTime: Infinity,
    enabled: enabled && invoiceId.length > 0,
  });
};

/**
 * Fetches (and caches) the payment client secret for the current engine.
 *
 * The query is intentionally disabled until modal state indicates that a
 * payment method requiring a client secret is selected and usable.
 */
export const useRequestPaymentClientSecret = (
  params: UseRequestPaymentClientSecretParams,
) =>
  useQuery({
    ...requestPaymentClientSecretQueryOptions(params),
  });
