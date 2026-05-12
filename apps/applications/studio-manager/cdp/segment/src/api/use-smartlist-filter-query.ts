import { useQuery } from "@tanstack/react-query";

import {
  PAYMENT_PACK_FILTER_IDENTIFIER,
  type PaymentPackFilter,
  type SmartlistGetFiltersResponse,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import { fetch } from "#src/utils/fetch";

const mapPaymentPackFilters = (
  payload?: SmartlistGetFiltersResponse,
): PaymentPackFilter[] => {
  const paymentPackFiltersMap = payload?.[PAYMENT_PACK_FILTER_IDENTIFIER];
  if (!paymentPackFiltersMap) {
    return [];
  }

  return Object.values(paymentPackFiltersMap)
    .map((filter) => filter as PaymentPackFilter)
    .sort((leftFilter, rightFilter) => {
      return leftFilter.id - rightFilter.id;
    });
};

export const useSmartlistFilterQuery = (smartlistId: string) =>
  useQuery({
    ...smartlistFiltersQueryOptions(fetch, smartlistId),
    select: (data) => mapPaymentPackFilters(data),
  });
