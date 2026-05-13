import { useQuery } from "@tanstack/react-query";

import {
  PAYMENT_PACK_FILTER_IDENTIFIER,
  type PaymentPackFilter,
  type SmartlistGetFiltersResponse,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  type TotalBookingFilter,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import {
  isPaymentPackFilter,
  isTotalBookingFilter,
} from "#src/components/filters/shared/types-guards";
import { fetch } from "#src/utils/fetch";

type SmartlistFiltersQueryData = {
  paymentPackFilters: PaymentPackFilter[];
  totalBookingFilters: TotalBookingFilter[];
};

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

const mapTotalBookingFilters = (
  payload?: SmartlistGetFiltersResponse,
): TotalBookingFilter[] => {
  const totalBookingFiltersMap = payload?.[TOTAL_BOOKING_FILTER_IDENTIFIER];
  if (!totalBookingFiltersMap) {
    return [];
  }

  return Object.values(totalBookingFiltersMap)
    .filter(isTotalBookingFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

/**
 * Unified smartlist filters hydration query.
 * Parses all currently supported filter families from one `get_filters` payload.
 */
export const useSmartlistFiltersQuery = (smartlistId: string) =>
  useQuery({
    ...smartlistFiltersQueryOptions(fetch, smartlistId),
    select: (data): SmartlistFiltersQueryData => ({
      paymentPackFilters: mapPaymentPackFilters(data),
      totalBookingFilters: mapTotalBookingFilters(data),
    }),
  });
