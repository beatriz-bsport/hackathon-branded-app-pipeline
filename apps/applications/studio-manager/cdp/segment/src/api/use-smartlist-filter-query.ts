import { useQuery } from "@tanstack/react-query";

import {
  PAYMENT_PACK_FILTER_IDENTIFIER,
  type PaymentPackFilter,
  type SmartlistGetFiltersResponse,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import { isPaymentPackFilter } from "#src/components/filters/shared/types-guards";
import { fetch } from "#src/utils/fetch";

const mapPaymentPackFilters = (
  payload?: SmartlistGetFiltersResponse,
): PaymentPackFilter[] => {
  const paymentPackFiltersMap = payload?.[PAYMENT_PACK_FILTER_IDENTIFIER];
  if (!paymentPackFiltersMap) {
    return [];
  }

  return Object.values(paymentPackFiltersMap)
    .filter(isPaymentPackFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

export const useSmartlistFilterQuery = (smartlistId: string) =>
  useQuery({
    ...smartlistFiltersQueryOptions(fetch, smartlistId),
    select: (data) => mapPaymentPackFilters(data),
  });
