import {
  ACTIVE_PASSES_FILTER_IDENTIFIER,
  ActivePassesFilter,
  BOOKING_MILESTONE_FILTER_IDENTIFIER,
  BookingMilestoneFilter,
  GENDER_FILTER_IDENTIFIER,
  GenderFilter,
  MEMBER_DATE_JOINED_FILTER_IDENTIFIER,
  MemberDateJoinedFilter,
  PAYMENT_PACK_FILTER_IDENTIFIER,
  PaymentPackFilter,
  TAG_FILTER_IDENTIFIER,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  TagFilter,
  TotalBookingFilter,
} from "@bsport/api-cdp/smartlist";

/**
 * Filter type ids rendered and drafted by the segment smartlist filters manager.
 */
export const SMARTLIST_FILTERS_MANAGER_FILTER_TYPES = {
  gender: "gender",
  memberSignUpDate: "memberSignUpDate",
  passes: "passes",
  totalBookingNumber: "totalBookingNumber",
  bookingMilestone: "bookingMilestone",
  tags: "tags",
  activePasses: "activePasses",
} as const;

export type SmartlistFiltersManagerFilterType =
  (typeof SMARTLIST_FILTERS_MANAGER_FILTER_TYPES)[keyof typeof SMARTLIST_FILTERS_MANAGER_FILTER_TYPES];

/**
 * Narrows a string (e.g. menu option id from the filter selector) to a known manager filter type.
 */
export const isSmartlistFiltersManagerFilterType = (
  value: string,
): value is SmartlistFiltersManagerFilterType =>
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.gender ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.memberSignUpDate ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.passes ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.totalBookingNumber ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.tags ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.bookingMilestone ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.activePasses;

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
  hasNumber(value, "nb_active_passes_value");
