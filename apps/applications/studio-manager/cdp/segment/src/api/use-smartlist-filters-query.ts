import { useQuery } from "@tanstack/react-query";

import {
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  type ActivePassesFilter,
  BOOKING_MILESTONE_FILTER_IDENTIFIER,
  type BookingMilestoneFilter,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  type PaymentPackFilter,
  type SmartlistGetFiltersResponse,
  TAG_FILTER_IDENTIFIER,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  type TagFilter,
  type TotalBookingFilter,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import {
  isActivePassesFilter,
  isBookingMilestoneFilter,
  isPaymentPackFilter,
  isTagFilter,
  isTotalBookingFilter,
} from "#src/components/filters/shared/types-guards";
import { fetch } from "#src/utils/fetch";

type SmartlistFiltersQueryData = {
  paymentPackFilters: PaymentPackFilter[];
  totalBookingFilters: TotalBookingFilter[];
  bookingMilestoneFilters: BookingMilestoneFilter[];
  tagFilters: TagFilter[];
  activePassesFilters: ActivePassesFilter[];
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

const mapBookingMilestoneFilters = (
  payload?: SmartlistGetFiltersResponse,
): BookingMilestoneFilter[] => {
  const bookingMilestoneFiltersMap =
    payload?.[BOOKING_MILESTONE_FILTER_IDENTIFIER];
  if (!bookingMilestoneFiltersMap) {
    return [];
  }

  return Object.values(bookingMilestoneFiltersMap)
    .filter(isBookingMilestoneFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapTagFilters = (payload?: SmartlistGetFiltersResponse): TagFilter[] => {
  const tagFiltersMap = payload?.[TAG_FILTER_IDENTIFIER];
  if (!tagFiltersMap) {
    return [];
  }

  return Object.values(tagFiltersMap)
    .filter(isTagFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapActivePassesFilters = (
  payload?: SmartlistGetFiltersResponse,
): ActivePassesFilter[] => {
  const activePassesFiltersMap = payload?.[ACTIVE_PASSES_FILTER_IDENTIFIER];
  if (!activePassesFiltersMap) {
    return [];
  }

  return Object.values(activePassesFiltersMap)
    .filter(isActivePassesFilter)
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
      bookingMilestoneFilters: mapBookingMilestoneFilters(data),
      tagFilters: mapTagFilters(data),
      activePassesFilters: mapActivePassesFilters(data),
    }),
  });
