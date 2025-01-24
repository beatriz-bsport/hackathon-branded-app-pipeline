export const FILTERS_ROOTS = {
  1: 'credit_account_filter',
  2: 'last_previous_booking_filter',
  5: 'gender_filter',
  8: 'has_valid_consumer_pack_filter',
  11: 'tag_filter',
  14: 'expenses_filter',
  18: 'member_date_joined',
  19: 'payment_pack',
  20: 'basket_abandonment',
  21: 'bookings_number',
  22: 'bookings',
  24: 'expenses_complete',
  25: 'private_pass',
  26: 'private_bookings',
  27: 'active_passes',
  28: 'first_purchase',
  29: 'referrer',
  30: 'referred_members',
  400: 'has_password',
  410: 'waiver',
  501: 'last_booking',
  600: 'payment_method',
  101: 'age',
  102: 'custom_form',
  103: 'marketing_notifications',
  104: 'notes',
  105: 'relations',
  106: 'has_phone',
  107: 'terms_and_conditions',
};

export const CREDIT_ACCOUNT_FILTER_IDENTIFIER = 1;
export const LAST_PREVIOUS_BOOKING_FILTER_IDENTIFIER = 2;
export const GENDER_FILTER_IDENTIFIER = 5;
export const HAS_VALID_CONSUMER_PACK_FILTER_IDENTIFIER = 8;
export const TAG_FILTER_IDENTIFIER = 11;
export const EXPENSES_FILTER_IDENTIFIER = 14;
export const MEMBER_DATE_JOINED_FILTER_IDENTIFIER = 18;
export const PAYMENT_PACK_FILTER_IDENTIFIER = 19;
export const BASKET_ABANDONMENT_FILTER_IDENTIFIER = 20;
export const BOOKINGS_NUMBER_FILTER_IDENTIFIER = 21;
export const BOOKINGS_FILTER_IDENTIFIER = 22;
export const FIRST_BOOKING_FILTER_IDENTIFIER = 23;
export const EXPENSES_COMPLETE_FILTER_IDENTIFIER = 24;
export const PRIVATE_PASS_FILTER_IDENTIFIER = 25;
export const PRIVATE_BOOKINGS_FILTER_IDENTIFIER = 26;
export const ACTIVE_PASSES_FILTER_IDENTIFIER = 27;
export const FIRST_PURCHASE_FILTER_IDENTIFIER = 28;
export const REFERRER_FILTER_IDENTIFIER = 29;
export const REFERRED_MEMBERS_FILTER_IDENTIFIER = 30;

export const USER_HAS_PASSWORD_FILTER = 400;
export const WAIVER_FILTER_IDENTIFIER = 410;
export const FILTER_BOOKING_LAST = 501;

export const PAYMENT_METHOD_FILTER_IDENTIFIER = 600;

export const AGE_FILTER_IDENTIFIER = 101;
export const CUSTOM_FORMS_FILTER_IDENTIFIER = 102;
export const USER_MARKETING_NOTIFICATIONS_FILTER = 103;
export const NOTES_FILTER_IDENTIFIER = 104;
export const RELATIONS_FILTER_IDENTIFIER = 105;
export const USER_HAS_PHONE_FILTER_IDENTIFIER = 106;
export const TERMS_AND_CONDITIONS_FILTER_IDENTIFIER = 107;

export const LTE_COMPARATOR = 1;
export const GTE_COMPARATOR = 2;
export const LT_COMPARATOR = 3;
export const GT_COMPARATOR = 4;
export const E_COMPARATOR = 5;
export const BETWEEN_COMPARATOR = 6;

// new CustomFormsFilter
export const NO_FORM = 0;
export const ALL_FORMS = 1;
export const AT_LEAST_ONE_FORM = 2;

export const DURATION_COMPARATORS_DICT_BETWEEN = [
  { key: 'inf', value: LTE_COMPARATOR, name: 'moins de' },
  { key: 'sup', value: GTE_COMPARATOR, name: 'plus de' },
  { key: 'eg', value: E_COMPARATOR, name: 'exactement' },
  { key: 'between', value: BETWEEN_COMPARATOR, name: 'entre' },
];

export const COMPARATORS_DICT_BETWEEN = [
  { key: 'inf', value: LTE_COMPARATOR, name: 'inférieur' },
  { key: 'sup', value: GTE_COMPARATOR, name: 'supérieur' },
  { key: 'eg', value: E_COMPARATOR, name: 'égal' },
  { key: 'between', value: BETWEEN_COMPARATOR, name: 'entre' },
];

// depreciated when front updated
export const COMPARATORS_DICT = [
  { key: 'inf', value: LTE_COMPARATOR, name: 'moins de' },
  { key: 'sup', value: GTE_COMPARATOR, name: 'plus de' },
  { key: 'eg', value: E_COMPARATOR, name: 'exactement' },
];
export const DURATION_COMPARATORS_DICT = [
  { key: 'inf', value: LTE_COMPARATOR, name: 'moins de' },
  { key: 'sup', value: GTE_COMPARATOR, name: 'plus de' },
  { key: 'eg', value: E_COMPARATOR, name: 'exactement' },
];

// Smartlist Automated campaign
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN = 17000;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_LIMIT_FOR_SMARTLIST_REACHED = 170001;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_TITLE = 17101;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_BODY = 17102;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_SMS_WITH_NO_BODY = 17103;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_TITLE = 17104;
export const EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_BODY = 17105;
export const SEND_COMMUNICATION_ON_JOIN = 0;
export const SEND_COMMUNICATION_ON_LEFT = 1;
