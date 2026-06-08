import {
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  AGE_FILTER_IDENTIFIER,
  ActivePassesFilter,
  type AgeFilter,
  BASKET_ABANDONMENT_FILTER_IDENTIFIER,
  BOOKING_MILESTONE_FILTER_IDENTIFIER,
  type BasketAbandonmentFilter,
  BookingMilestoneFilter,
  CREDIT_ACCOUNT_FILTER_IDENTIFIER,
  CreditAccountFilter,
  EXPENSES_COMPLETE_FILTER_IDENTIFIER,
  type ExpensesCompleteFilter,
  FIRST_PURCHASE_FILTER_IDENTIFIER,
  FirstPurchaseFilter,
  GENDER_FILTER_IDENTIFIER,
  GenderFilter,
  HAS_PHONE_FILTER_IDENTIFIER,
  type HasPhoneFilter,
  LAST_BOOKING_FILTER_IDENTIFIER,
  type LastBookingFilter,
  MARKETING_NOTIFICATION_FILTER_IDENTIFIER,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  type MarketingNotificationFilter,
  MemberDateJoinedFilter,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  PRIVATE_BOOKINGS_FILTER_IDENTIFIER,
  PRIVATE_PASS_FILTER_IDENTIFIER,
  PaymentPackFilter,
  PrivateBookingsFilter,
  PrivatePassFilter,
  TAG_FILTER_IDENTIFIER,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  TagFilter,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

/**
 * Filter type ids rendered and drafted by the segment smartlist filters manager.
 */
export const SMARTLIST_FILTERS_MANAGER_FILTER_TYPES = {
  age: "age",
  gender: "gender",
  memberSignUpDate: "memberSignUpDate",
  passes: "passes",
  appointmentPass: "appointmentPass",
  totalBookingNumber: "totalBookingNumber",
  totalAppointmentsNumber: "totalAppointmentsNumber",
  bookingMilestone: "bookingMilestone",
  tags: "tags",
  activePasses: "activePasses",
  firstPurchase: "firstPurchase",
  basketAbandonment: "basketAbandonment",
  purchaseHistory: "purchaseHistory",
  creditAccount: "creditAccount",
  marketingNotification: "marketingNotification",
  hasPhone: "hasPhone",
  lastBooking: "lastBooking",
} as const;

export type SmartlistFiltersManagerFilterType =
  (typeof SMARTLIST_FILTERS_MANAGER_FILTER_TYPES)[keyof typeof SMARTLIST_FILTERS_MANAGER_FILTER_TYPES];

/**
 * Narrows a string (e.g. menu option id from the filter selector) to a known manager filter type.
 */
export const isSmartlistFiltersManagerFilterType = (
  value: string,
): value is SmartlistFiltersManagerFilterType =>
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.age ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.gender ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.memberSignUpDate ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.passes ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.appointmentPass ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalBookingNumber ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalAppointmentsNumber ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.tags ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.bookingMilestone ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.activePasses ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.firstPurchase ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.basketAbandonment ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.purchaseHistory ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.creditAccount ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.marketingNotification ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.hasPhone ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.lastBooking;

export const isBasketAbandonmentFilter = (
  value: unknown,
): value is BasketAbandonmentFilter =>
  hasFilterIdentifier(value, BASKET_ABANDONMENT_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "basket_value") &&
  hasNumber(value, "basket_value_second") &&
  hasBoolean(value, "date_filter_active");

export const isAgeFilter = (value: unknown): value is AgeFilter =>
  hasFilterIdentifier(value, AGE_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "value") &&
  hasNumber(value, "value_second");

export const isCreditAccountFilter = (
  value: unknown,
): value is CreditAccountFilter =>
  hasFilterIdentifier(value, CREDIT_ACCOUNT_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "value") &&
  hasNumber(value, "value_second");

export const isObjectRecord = (
  value: unknown,
): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const hasNumber = (value: unknown, key: string): boolean =>
  isObjectRecord(value) && typeof value[key] === "number";

export const hasBoolean = (value: unknown, key: string): boolean =>
  isObjectRecord(value) && typeof value[key] === "boolean";

export const hasNumberArray = (value: unknown, key: string): boolean =>
  isObjectRecord(value) &&
  Array.isArray(value[key]) &&
  value[key].every((item) => typeof item === "number");

/**
 * Checks that a payload carries the expected smartlist `filter_identifier`.
 * This is the primary discriminator between filter families that share overlapping shapes.
 */
export const hasFilterIdentifier = (
  value: unknown,
  filterIdentifier: string,
): boolean =>
  hasNumber(value, "filter_identifier") &&
  (value as { filter_identifier: number }).filter_identifier ===
    Number(filterIdentifier);

export const hasString = (value: unknown, key: string): boolean =>
  isObjectRecord(value) && typeof value[key] === "string";

export const isGenderFilter = (value: unknown): value is GenderFilter =>
  isObjectRecord(value) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasString(value, "value") &&
  hasFilterIdentifier(value, GENDER_FILTER_IDENTIFIER);

export const isMemberDateJoinedFilter = (
  value: unknown,
): value is MemberDateJoinedFilter =>
  isObjectRecord(value) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "date_filter_type") &&
  hasNumber(value, "duration") &&
  hasNumber(value, "duration_second") &&
  hasFilterIdentifier(value, MEMBER_DATE_JOINED_FILTER_IDENTIFIER);

export const isPaymentPackFilter = (
  value: unknown,
): value is PaymentPackFilter =>
  hasFilterIdentifier(value, PAYMENT_PACK_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "has_pack") &&
  hasBoolean(value, "select_all_payment_packs") &&
  hasNumberArray(value, "payment_packs");

export const isPrivatePassFilter = (
  value: unknown,
): value is PrivatePassFilter =>
  hasFilterIdentifier(value, PRIVATE_PASS_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "has_pack") &&
  hasBoolean(value, "select_all_private_passes") &&
  hasNumberArray(value, "private_passes");

export const isTotalBookingFilter = (
  value: unknown,
): value is TotalBookingFilter =>
  hasFilterIdentifier(value, TOTAL_BOOKING_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "value") &&
  hasNumber(value, "value_second");

export const isTagFilter = (value: unknown): value is TagFilter =>
  hasFilterIdentifier(value, TAG_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumberArray(value, "tags_included") &&
  hasNumberArray(value, "tags_excluded");

export const isBookingMilestoneFilter = (
  value: unknown,
): value is BookingMilestoneFilter =>
  hasFilterIdentifier(value, BOOKING_MILESTONE_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "value");

export const isPrivateBookingsFilter = (
  value: unknown,
): value is PrivateBookingsFilter =>
  hasFilterIdentifier(value, PRIVATE_BOOKINGS_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "value") &&
  hasNumber(value, "value_second");

export const isActivePassesFilter = (
  value: unknown,
): value is ActivePassesFilter =>
  isObjectRecord(value) &&
  hasFilterIdentifier(value, ACTIVE_PASSES_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "filter_identifier") &&
  hasBoolean(value, "select_all_payment_packs") &&
  hasNumberArray(value, "payment_packs") &&
  hasBoolean(value, "select_all_private_passes") &&
  hasNumberArray(value, "private_passes") &&
  hasNumber(value, "nb_active_passes_comparator") &&
  hasNumber(value, "nb_active_passes_value") &&
  hasNumber(value, "nb_active_passes_value_second");

export const isFirstPurchaseFilter = (
  value: unknown,
): value is FirstPurchaseFilter =>
  hasFilterIdentifier(value, FIRST_PURCHASE_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "first_payment_is_done");

export const isExpensesCompleteFilter = (
  value: unknown,
): value is ExpensesCompleteFilter =>
  hasFilterIdentifier(value, EXPENSES_COMPLETE_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator") &&
  hasNumber(value, "value") &&
  hasNumber(value, "value_second") &&
  hasNumberArray(value, "buyable_identifiers") &&
  hasBoolean(value, "date_filter_active");

export const isMarketingNotificationFilter = (
  value: unknown,
): value is MarketingNotificationFilter =>
  hasFilterIdentifier(value, MARKETING_NOTIFICATION_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "sms_value") &&
  hasBoolean(value, "email_value") &&
  hasBoolean(value, "is_condition_and") &&
  hasBoolean(value, "is_v2") &&
  hasBoolean(value, "all_filters_must_be_right");

export const isHasPhoneFilter = (value: unknown): value is HasPhoneFilter =>
  hasFilterIdentifier(value, HAS_PHONE_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "value");

export const isLastBookingFilter = (
  value: unknown,
): value is LastBookingFilter =>
  hasFilterIdentifier(value, LAST_BOOKING_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "value");
