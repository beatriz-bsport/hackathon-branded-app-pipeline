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
  CUSTOM_FORM_FILTER_IDENTIFIER,
  type CreditAccountFilter,
  type CustomFormFilter,
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
  TAG_FILTER_IDENTIFIER,
  TERMS_AND_CONDITIONS_FILTER_IDENTIFIER,
  TOTAL_BOOKING_FILTER_IDENTIFIER,
  type TagFilter,
  type TermsAndConditionsFilter,
  type TotalBookingFilter,
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
  referredMembers: "referredMembers",
  creditAccount: "creditAccount",
  marketingNotification: "marketingNotification",
  hasPhone: "hasPhone",
  termsAndConditions: "termsAndConditions",
  liabilityWaiver: "liabilityWaiver",
  hasPassword: "hasPassword",
  lastBooking: "lastBooking",
  internalNotes: "internalNotes",
  paymentMethod: "paymentMethod",
  referrer: "referrer",
  relationships: "relationships",
  formCompletion: "formCompletion",
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
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.referredMembers ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.creditAccount ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.marketingNotification ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.hasPhone ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.termsAndConditions ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.liabilityWaiver ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.lastBooking ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.internalNotes ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.hasPassword ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.paymentMethod ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.referrer ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.relationships ||
  value === SMARTLIST_FILTERS_MANAGER_FILTER_TYPES.formCompletion;

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

export const isReferredMemberFilter = (
  value: unknown,
): value is ReferredMemberFilter =>
  hasFilterIdentifier(value, REFERRED_MEMBERS_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "is_referred") &&
  hasBoolean(value, "money_obtained_active") &&
  hasNumber(value, "money_obtained_comparator") &&
  hasNumber(value, "money_obtained") &&
  hasNumber(value, "money_obtained_second");

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

export const isTermsAndConditionsFilter = (
  value: unknown,
): value is TermsAndConditionsFilter =>
  hasFilterIdentifier(value, TERMS_AND_CONDITIONS_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "value");

export const isLiabilityWaiverFilter = (
  value: unknown,
): value is LiabilityWaiverFilter =>
  hasFilterIdentifier(value, LIABILITY_WAIVER_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "value");

export const isHasPasswordFilter = (
  value: unknown,
): value is HasPasswordFilter =>
  hasFilterIdentifier(value, HAS_PASSWORD_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasBoolean(value, "value");

export const isLastBookingFilter = (
  value: unknown,
): value is LastBookingFilter =>
  hasFilterIdentifier(value, LAST_BOOKING_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "value");

export const isNotesFilter = (value: unknown): value is NotesFilter =>
  hasFilterIdentifier(value, NOTES_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "date_filter_active");

export const isPaymentMethodFilter = (
  value: unknown,
): value is PaymentMethodFilter =>
  hasFilterIdentifier(value, PAYMENT_METHOD_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "owns_payment_method") &&
  hasBoolean(value, "date_filter_active") &&
  hasNumber(value, "date_filter_type") &&
  hasNumber(value, "duration") &&
  hasNumber(value, "duration_second") &&
  hasBoolean(value, "payment_method_kind_filter_active");

export const isReferrerFilter = (value: unknown): value is ReferrerFilter =>
  hasFilterIdentifier(value, REFERRER_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company_id") &&
  hasNumber(value, "comparator_referred") &&
  hasNumber(value, "value_referred") &&
  hasNumber(value, "value_second_referred") &&
  hasBoolean(value, "value_obtained_reward_active") &&
  hasNumber(value, "value_obtained_reward") &&
  hasNumber(value, "value_second_reward") &&
  hasNumber(value, "comparator_reward") &&
  hasBoolean(value, "value_obtained_money_active") &&
  hasNumber(value, "value_obtained_money") &&
  hasNumber(value, "value_second_obtained_money") &&
  hasNumber(value, "comparator_obtained_money");

export const isRelationsFilter = (value: unknown): value is RelationsFilter =>
  hasFilterIdentifier(value, RELATIONS_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasNumber(value, "comparator_number_relations") &&
  hasNumber(value, "value_number_relations") &&
  hasNumber(value, "value_number_relations_second") &&
  hasBoolean(value, "date_filter_active") &&
  hasBoolean(value, "number_relations_consumer_payment_packs_filter_active") &&
  hasBoolean(value, "number_relations_consumer_private_passes_filter_active") &&
  hasBoolean(value, "number_relations_bookings_filter_active") &&
  hasBoolean(value, "relation_receive_copy_of_email_filter_active") &&
  hasBoolean(value, "relation_accept_sms_filter_active") &&
  hasBoolean(value, "relation_accept_email_filter_active");

export const isCustomFormFilter = (value: unknown): value is CustomFormFilter =>
  hasFilterIdentifier(value, CUSTOM_FORM_FILTER_IDENTIFIER) &&
  hasNumber(value, "id") &&
  hasNumber(value, "smartlist") &&
  hasNumber(value, "company") &&
  hasBoolean(value, "is_v2") &&
  hasNumber(value, "all_selected_must_fulfill_condition_v2") &&
  hasNumberArray(value, "custom_forms") &&
  hasBoolean(value, "has_filled") &&
  hasBoolean(value, "all_selected_must_fulfill_condition") &&
  hasBoolean(value, "date_filter_active") &&
  hasBoolean(value, "completion_percentage_filter_active");
