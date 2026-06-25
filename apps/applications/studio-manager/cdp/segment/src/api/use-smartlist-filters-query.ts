import { useQuery } from "@tanstack/react-query";

import {
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  AGE_FILTER_IDENTIFIER,
  type ActivePassesFilter,
  type AgeFilter,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKING_MILESTONE_FILTER_IDENTIFIER,
  type BasketAbandonmentFilter,
  type BookingMilestoneFilter,
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  type CreditAccountFilter,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  type ExpensesCompleteFilter,
  FIRST_PURCHASE_FILTER_IDENTIFIER,
  type FirstPurchaseFilter,
  GENDER_FILTER_IDENTIFIER,
  type GenderFilter,
  HAS_PASSWORD_FILTER_IDENTIFIER,
  HAS_PHONE_FILTER_IDENTIFIER,
  type HasPasswordFilter,
  type HasPhoneFilter,
  LAST_BOOKING_FILTER_IDENTIFIER,
  LIABILITY_WAIVER_FILTER_IDENTIFIER,
  type LastBookingFilter,
  type LiabilityWaiverFilter,
  MARKETING_NOTIFICATION_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  type MarketingNotificationFilter,
  type MemberDateJoinedFilter,
  NOTES_FILTER_IDENTIFIER,
  type NotesFilter,
  PAYMENT_METHOD_FILTER_IDENTIFIER,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  PRIVATE_PASS_FILTER_IDENTIFIER,
  type PaymentMethodFilter,
  type PaymentPackFilter,
  type PrivateBookingsFilter,
  type PrivatePassFilter,
  REFERRED_MEMBERS_FILTER_IDENTIFIER,
  REFERRER_FILTER_IDENTIFIER,
  RELATIONS_FILTER_IDENTIFIER,
  type ReferredMemberFilter,
  type ReferrerFilter,
  type RelationsFilter,
  type SmartlistGetFiltersResponse,
  TAG_FILTER_IDENTIFIER,
  TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  type TagFilter,
  type TermsAndConditionsFilter,
  type TotalBookingFilter,
  smartlistFiltersQueryOptions,
} from "@bsport/api-cdp/smartlist";

import {
  isActivePassesFilter,
  isAgeFilter,
  isBasketAbandonmentFilter,
  isBookingMilestoneFilter,
  isCreditAccountFilter,
  isExpensesCompleteFilter,
  isFirstPurchaseFilter,
  isGenderFilter,
  isHasPasswordFilter,
  isHasPhoneFilter,
  isLastBookingFilter,
  isLiabilityWaiverFilter,
  isMarketingNotificationFilter,
  isMemberDateJoinedFilter,
  isNotesFilter,
  isPaymentMethodFilter,
  isPaymentPackFilter,
  isPrivateBookingsFilter,
  isPrivatePassFilter,
  isReferredMemberFilter,
  isReferrerFilter,
  isRelationsFilter,
  isTagFilter,
  isTermsAndConditionsFilter,
  isTotalBookingFilter,
} from "#src/components/filters/shared/types-guards";
import { fetch } from "#src/utils/fetch";

export type SmartlistFilterCollections = {
  ageFilters: AgeFilter[];
  genderFilters: GenderFilter[];
  memberDateJoinedFilters: MemberDateJoinedFilter[];
  paymentPackFilters: PaymentPackFilter[];
  privatePassFilters: PrivatePassFilter[];
  totalBookingFilters: TotalBookingFilter[];
  totalAppointmentsFilters: PrivateBookingsFilter[];
  bookingMilestoneFilters: BookingMilestoneFilter[];
  tagFilters: TagFilter[];
  activePassesFilters: ActivePassesFilter[];
  firstPurchaseFilters: FirstPurchaseFilter[];
  basketAbandonmentFilters: BasketAbandonmentFilter[];
  purchaseHistoryFilters: ExpensesCompleteFilter[];
  referredMemberFilters: ReferredMemberFilter[];
  creditAccountFilters: CreditAccountFilter[];
  marketingNotificationFilters: MarketingNotificationFilter[];
  hasPhoneFilters: HasPhoneFilter[];
  termsAndConditionsFilters: TermsAndConditionsFilter[];
  liabilityWaiverFilters: LiabilityWaiverFilter[];
  hasPasswordFilters: HasPasswordFilter[];
  lastBookingFilters: LastBookingFilter[];
  internalNotesFilters: NotesFilter[];
  paymentMethodFilters: PaymentMethodFilter[];
  referrerFilters: ReferrerFilter[];
  relationsFilters: RelationsFilter[];
};

export type SmartlistFiltersQueryData = SmartlistFilterCollections & {
  filtersCount: number;
};

/**
 * Counts every saved filter row across all supported filter families.
 */
export const countSmartlistFilterRows = (
  filters: SmartlistFilterCollections,
): number =>
  Object.values(filters).reduce(
    (total, filterRows) => total + filterRows.length,
    0,
  );

const mapSmartlistFilterCollections = (
  payload?: SmartlistGetFiltersResponse,
): SmartlistFilterCollections => ({
  ageFilters: mapAgeFilters(payload),
  genderFilters: mapGenderFilters(payload),
  memberDateJoinedFilters: mapMemberDateJoinedFilters(payload),
  paymentPackFilters: mapPaymentPackFilters(payload),
  privatePassFilters: mapPrivatePassFilters(payload),
  totalBookingFilters: mapTotalBookingFilters(payload),
  totalAppointmentsFilters: mapTotalAppointmentsFilters(payload),
  bookingMilestoneFilters: mapBookingMilestoneFilters(payload),
  tagFilters: mapTagFilters(payload),
  activePassesFilters: mapActivePassesFilters(payload),
  firstPurchaseFilters: mapFirstPurchaseFilters(payload),
  basketAbandonmentFilters: mapBasketAbandonmentFilters(payload),
  purchaseHistoryFilters: mapPurchaseHistoryFilters(payload),
  referredMemberFilters: mapReferredMemberFilters(payload),
  creditAccountFilters: mapCreditAccountFilters(payload),
  marketingNotificationFilters: mapMarketingNotificationFilters(payload),
  hasPhoneFilters: mapHasPhoneFilters(payload),
  termsAndConditionsFilters: mapTermsAndConditionsFilters(payload),
  liabilityWaiverFilters: mapLiabilityWaiverFilters(payload),
  hasPasswordFilters: mapHasPasswordFilters(payload),
  lastBookingFilters: mapLastBookingFilters(payload),
  internalNotesFilters: mapInternalNotesFilters(payload),
  paymentMethodFilters: mapPaymentMethodFilters(payload),
  referrerFilters: mapReferrerFilters(payload),
  relationsFilters: mapRelationsFilters(payload),
});

/**
 * Maps the raw `get_filters` payload into query data with a precomputed row count.
 */
export const selectSmartlistFiltersQueryData = (
  payload: SmartlistGetFiltersResponse,
): SmartlistFiltersQueryData => {
  const filters = mapSmartlistFilterCollections(payload);

  return {
    ...filters,
    filtersCount: countSmartlistFilterRows(filters),
  };
};

const mapAgeFilters = (payload?: SmartlistGetFiltersResponse): AgeFilter[] => {
  const ageFiltersMap = payload?.[AGE_FILTER_IDENTIFIER];
  if (!ageFiltersMap) {
    return [];
  }

  return Object.values(ageFiltersMap)
    .filter(isAgeFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapGenderFilters = (
  payload?: SmartlistGetFiltersResponse,
): GenderFilter[] => {
  const genderFiltersMap = payload?.[GENDER_FILTER_IDENTIFIER];
  if (!genderFiltersMap) {
    return [];
  }

  return Object.values(genderFiltersMap)
    .filter(isGenderFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapMemberDateJoinedFilters = (
  payload?: SmartlistGetFiltersResponse,
): MemberDateJoinedFilter[] => {
  const memberDateJoinedFiltersMap =
    payload?.[MEMBER_DATE_JOINED_FILTER_IDENTIFIER];
  if (!memberDateJoinedFiltersMap) {
    return [];
  }

  return Object.values(memberDateJoinedFiltersMap)
    .filter(isMemberDateJoinedFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
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

const mapPrivatePassFilters = (
  payload?: SmartlistGetFiltersResponse,
): PrivatePassFilter[] => {
  const privatePassFiltersMap = payload?.[PRIVATE_PASS_FILTER_IDENTIFIER];
  if (!privatePassFiltersMap) {
    return [];
  }

  return Object.values(privatePassFiltersMap)
    .filter(isPrivatePassFilter)
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

const mapTotalAppointmentsFilters = (
  payload?: SmartlistGetFiltersResponse,
): PrivateBookingsFilter[] => {
  const totalAppointmentsFiltersMap =
    payload?.[PRIVATE_BOOKINGS_FILTER_IDENTIFIER];
  if (!totalAppointmentsFiltersMap) {
    return [];
  }

  return Object.values(totalAppointmentsFiltersMap)
    .filter(isPrivateBookingsFilter)
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

const mapCreditAccountFilters = (
  payload?: SmartlistGetFiltersResponse,
): CreditAccountFilter[] => {
  const creditAccountFiltersMap = payload?.[CREDIT_ACCOUNT_FILTER_IDENTIFIER];
  if (!creditAccountFiltersMap) {
    return [];
  }

  return Object.values(creditAccountFiltersMap)
    .filter(isCreditAccountFilter)
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

const mapFirstPurchaseFilters = (
  payload?: SmartlistGetFiltersResponse,
): FirstPurchaseFilter[] => {
  const firstPurchaseFiltersMap = payload?.[FIRST_PURCHASE_FILTER_IDENTIFIER];
  if (!firstPurchaseFiltersMap) {
    return [];
  }

  return Object.values(firstPurchaseFiltersMap)
    .filter(isFirstPurchaseFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapBasketAbandonmentFilters = (
  payload?: SmartlistGetFiltersResponse,
): BasketAbandonmentFilter[] => {
  const basketAbandonmentFiltersMap =
    payload?.[BASKET_ABANDONMENT_FILTER_IDENTIFIER];
  if (!basketAbandonmentFiltersMap) {
    return [];
  }

  return Object.values(basketAbandonmentFiltersMap)
    .filter(isBasketAbandonmentFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapPurchaseHistoryFilters = (
  payload?: SmartlistGetFiltersResponse,
): ExpensesCompleteFilter[] => {
  const purchaseHistoryFiltersMap =
    payload?.[EXPENSES_COMPLETE_FILTER_IDENTIFIER];
  if (!purchaseHistoryFiltersMap) {
    return [];
  }

  return Object.values(purchaseHistoryFiltersMap)
    .filter(isExpensesCompleteFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapReferredMemberFilters = (
  payload?: SmartlistGetFiltersResponse,
): ReferredMemberFilter[] => {
  const referredMemberFiltersMap =
    payload?.[REFERRED_MEMBERS_FILTER_IDENTIFIER];
  if (!referredMemberFiltersMap) {
    return [];
  }

  return Object.values(referredMemberFiltersMap)
    .filter(isReferredMemberFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapMarketingNotificationFilters = (
  payload?: SmartlistGetFiltersResponse,
): MarketingNotificationFilter[] => {
  const marketingNotificationFiltersMap =
    payload?.[MARKETING_NOTIFICATION_FILTER_IDENTIFIER];
  if (!marketingNotificationFiltersMap) {
    return [];
  }

  return Object.values(marketingNotificationFiltersMap)
    .filter(isMarketingNotificationFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapHasPhoneFilters = (
  payload?: SmartlistGetFiltersResponse,
): HasPhoneFilter[] => {
  const hasPhoneFiltersMap = payload?.[HAS_PHONE_FILTER_IDENTIFIER];
  if (!hasPhoneFiltersMap) {
    return [];
  }

  return Object.values(hasPhoneFiltersMap)
    .filter(isHasPhoneFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapTermsAndConditionsFilters = (
  payload?: SmartlistGetFiltersResponse,
): TermsAndConditionsFilter[] => {
  const termsAndConditionsFiltersMap =
    payload?.[TERMS_AND_CONDITIONS_FILTER_IDENTIFIER];
  if (!termsAndConditionsFiltersMap) {
    return [];
  }

  return Object.values(termsAndConditionsFiltersMap)
    .filter(isTermsAndConditionsFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapLiabilityWaiverFilters = (
  payload?: SmartlistGetFiltersResponse,
): LiabilityWaiverFilter[] => {
  const liabilityWaiverFiltersMap =
    payload?.[LIABILITY_WAIVER_FILTER_IDENTIFIER];
  if (!liabilityWaiverFiltersMap) {
    return [];
  }

  return Object.values(liabilityWaiverFiltersMap)
    .filter(isLiabilityWaiverFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapHasPasswordFilters = (
  payload?: SmartlistGetFiltersResponse,
): HasPasswordFilter[] => {
  const hasPasswordFiltersMap = payload?.[HAS_PASSWORD_FILTER_IDENTIFIER];
  if (!hasPasswordFiltersMap) {
    return [];
  }

  return Object.values(hasPasswordFiltersMap)
    .filter(isHasPasswordFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapLastBookingFilters = (
  payload?: SmartlistGetFiltersResponse,
): LastBookingFilter[] => {
  const lastBookingFiltersMap = payload?.[LAST_BOOKING_FILTER_IDENTIFIER];
  if (!lastBookingFiltersMap) {
    return [];
  }

  return Object.values(lastBookingFiltersMap)
    .filter(isLastBookingFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapInternalNotesFilters = (
  payload?: SmartlistGetFiltersResponse,
): NotesFilter[] => {
  const internalNotesFiltersMap = payload?.[NOTES_FILTER_IDENTIFIER];
  if (!internalNotesFiltersMap) {
    return [];
  }

  return Object.values(internalNotesFiltersMap)
    .filter(isNotesFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapPaymentMethodFilters = (
  payload?: SmartlistGetFiltersResponse,
): PaymentMethodFilter[] => {
  const paymentMethodFiltersMap = payload?.[PAYMENT_METHOD_FILTER_IDENTIFIER];
  if (!paymentMethodFiltersMap) {
    return [];
  }

  return Object.values(paymentMethodFiltersMap)
    .filter(isPaymentMethodFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapReferrerFilters = (
  payload?: SmartlistGetFiltersResponse,
): ReferrerFilter[] => {
  const referrerFiltersMap = payload?.[REFERRER_FILTER_IDENTIFIER];
  if (!referrerFiltersMap) {
    return [];
  }

  return Object.values(referrerFiltersMap)
    .filter(isReferrerFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

const mapRelationsFilters = (
  payload?: SmartlistGetFiltersResponse,
): RelationsFilter[] => {
  const relationsFiltersMap = payload?.[RELATIONS_FILTER_IDENTIFIER];
  if (!relationsFiltersMap) {
    return [];
  }

  return Object.values(relationsFiltersMap)
    .filter(isRelationsFilter)
    .sort((leftFilter, rightFilter) => leftFilter.id - rightFilter.id);
};

export const useSmartlistFiltersQuery = (smartlistId: string) =>
  useQuery({
    ...smartlistFiltersQueryOptions(fetch, smartlistId),
    select: selectSmartlistFiltersQueryData,
  });
