import {
  DisputeMetadataIdentifierEnum,
  ExpenseMetadataIdentifierEnum,
  InvoiceMetadataIdentifierEnum,
  OnSpotPaymentMetadataIdentifierEnum,
  PaymentByInstalmentsMetadataIdentifierEnum,
  PaymentMetadataIdentifierEnum,
  ReferralGrantMetadataIdentifierEnum,
  UnpaidInvoiceMetadataIdentifierEnum,
} from '@bsport/common/lib/master-data/metadata-identifiers.js';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories.js';
import { BuyableItemOptions } from '#src/libs/checkout/types';
import type {
  DynamicFilterDataType,
  BillingPlanDynamicForeignKeyType,
} from '#src/libs/datatype-filtering/types';
import {
  PAYMENT_COMBO_DYNAMIC_FILTER,
  PAYMENT_PACK_DYNAMIC_FILTER,
  PRIVATE_PASS_DYNAMIC_FILTER,
} from '#src/libs/datatype-filtering/constants';

export const GREEN_GREY_BOOLEAN_CHIPS = [
  'new_member_only',
  'plan_auto_renewal',
  'is_recurring',
  'second_billing_plan',
];

export const RED_GREEN_BOOLEAN_CHIPS = [
  'attendance',
  'accept_email',
  'accept_sms',
  'marketplace_enabled',
  'is_rent',
];

export const RED_GREEN_INVERTED_BOOLEAN_CHIPS = [
  'is_no_show',
  'is_unpaid',
  'disabled',
  'roll_call_needs_validation',
];

export const STATUS_CHIPS = [
  'last_invoice_status',
  'plan_status',
  'booking_status_code',
  'payout_status',
  'dispute_status',
  'payment_status',
  'video_status',
  'initial_status',
  'updated_status',
];

export const CONDITION_CHIPS = [
  'available_credits',
  'rate_attendance',
  'nb_non_activated',
  'unpaid_amount',
  'rate_non_attendance',
  'cancel_rate',
  'stock',
];

export const CREDIT_COLUMNS = [
  'remaining_credits',
  'credit_consumed',
  'available_credits',
  'credits',
  'remaining_credits_annotated',
  'payment_method_manual_credit_card',
  'credit_price',
];

export const COMPANY_REPORT_CATEGORIES_BY_GLOBAL_CATEGORY = {
  Payments: [
    ReportCategoryEnum.BASKET,
    ReportCategoryEnum.CASHBOOK,
    ReportCategoryEnum.CREDIT,
    ReportCategoryEnum.EXPENSE,
    ReportCategoryEnum.INVOICES,
    ReportCategoryEnum.UNPAID_INVOICES,
    ReportCategoryEnum.PAYMENTS,
    ReportCategoryEnum.PAYMENT_SUMUP,
    ReportCategoryEnum.ON_SPOT_PAYMENTS,
    ReportCategoryEnum.DISPUTE,
    ReportCategoryEnum.PAYMENT_INSTALMENTS,
    ReportCategoryEnum.VIDEO_PURCHASE,
  ],
  Club: [
    ReportCategoryEnum.BILLING_PLAN,
    ReportCategoryEnum.MEMBERS_PURCHASE,
    ReportCategoryEnum.MEMBERS,
    ReportCategoryEnum.ACTIVITIES,
    ReportCategoryEnum.ACTIVITY_BY_ESTABLISHMENT,
    ReportCategoryEnum.ACTIVITY_BY_COACH,
    ReportCategoryEnum.WORKSHOP,
    ReportCategoryEnum.OFFERS,
    ReportCategoryEnum.SUBSCRIPTION,
    ReportCategoryEnum.PRIVATE_SERVICE,
    ReportCategoryEnum.REFERRAL_GRANT,
    ReportCategoryEnum.ACCESS_MONITORING,
  ],
  Bookings: [
    ReportCategoryEnum.DAY_BOOKINGS,
    ReportCategoryEnum.FIRST_BOOKING,
    ReportCategoryEnum.BOOKINGS,
    ReportCategoryEnum.FIRST_ATTENDANCE,
    ReportCategoryEnum.FIRST_PRIVATE_BOOKING,
    ReportCategoryEnum.PRIVATE_BOOKINGS,
    ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS,
  ],
  Products: [
    ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED,
    ReportCategoryEnum.EXPIRED_PASS,
    ReportCategoryEnum.MEMBERSHIPS,
    ReportCategoryEnum.PRIVATE_CONSUMER_PASS,
    ReportCategoryEnum.UNIVERSAL_PASSES,
    ReportCategoryEnum.DISCOUNT,
    ReportCategoryEnum.GIFTCARD,
    ReportCategoryEnum.CONSUMER_GIFTCARD,
    ReportCategoryEnum.SHOP,
    ReportCategoryEnum.VIDEO,
  ],
};

export const authorIdentifiers = [
  OnSpotPaymentMetadataIdentifierEnum.AUTHOR,
  PaymentMetadataIdentifierEnum.AUTHOR,
  PaymentByInstalmentsMetadataIdentifierEnum.AUTHOR,
  DisputeMetadataIdentifierEnum.AUTHOR,
  ExpenseMetadataIdentifierEnum.AUTHOR,
  InvoiceMetadataIdentifierEnum.AUTHOR,
  UnpaidInvoiceMetadataIdentifierEnum.AUTHOR_NAME,
] as string[];

export const REPORT_RIGHT_DRAWER_WIDTH = '1000px';

export const REPORT_NAME_MAX_LENGTH = 200;

export const CATEGORIES_NEEDING_HELPER_TEXT_FOR_DATES = [
  ReportCategoryEnum.ACTIVITIES,
  ReportCategoryEnum.ACTIVITY_BY_COACH,
  ReportCategoryEnum.ACTIVITY_BY_ESTABLISHMENT,
  ReportCategoryEnum.BILLING_PLAN,
  ReportCategoryEnum.BOOKINGS,
  ReportCategoryEnum.CASHBOOK,
  ReportCategoryEnum.CONSUMER_GIFTCARD,
  ReportCategoryEnum.DAY_BOOKINGS,
  ReportCategoryEnum.DISCOUNT,
  ReportCategoryEnum.DISPUTE,
  ReportCategoryEnum.EXPENSE,
  ReportCategoryEnum.EXPIRED_PASS,
  ReportCategoryEnum.FIRST_ATTENDANCE,
  ReportCategoryEnum.FIRST_BOOKING,
  ReportCategoryEnum.FIRST_PRIVATE_BOOKING,
  ReportCategoryEnum.INVOICES,
  ReportCategoryEnum.MEMBERS,
  ReportCategoryEnum.MEMBERSHIPS,
  ReportCategoryEnum.OFFERS,
  ReportCategoryEnum.ON_SPOT_PAYMENTS,
  ReportCategoryEnum.PAYMENT_INSTALMENTS,
  ReportCategoryEnum.PAYMENT_SUMUP,
  ReportCategoryEnum.PAYMENTS,
  ReportCategoryEnum.PRIVATE_BOOKINGS,
  ReportCategoryEnum.PRIVATE_CONSUMER_PASS_EXPIRED,
  ReportCategoryEnum.PRIVATE_CONSUMER_PASS,
  ReportCategoryEnum.PRIVATE_SERVICE,
  ReportCategoryEnum.REFERRAL_GRANT,
  ReportCategoryEnum.SHOP,
  ReportCategoryEnum.SUBSCRIPTION,
  ReportCategoryEnum.UNIVERSAL_PASSES,
  ReportCategoryEnum.UNPAID_PRIVATE_BOOKINGS,
  ReportCategoryEnum.VIDEO_PURCHASE,
  ReportCategoryEnum.WORKSHOP,
  ReportCategoryEnum.ACCESS_MONITORING,
];

export enum ReportDateType {
  NONE = 'none',
  RANGE = 'range',
  SINGLE = 'single',
}

export const drawerWidth = 220;
export const drawerSmallWidth = 44;

/**
 * ------ Constants below needs to be kept in sync with django repo ------
 * Filtering on member is only allowed when one of these column identifier is present in the report
 */

/** Member filtering is only possible once for identifiers in section below  */
export const MEMBER_FILTERING_COLUMN_IDENTIFIERS = [
  'first_name',
  'last_name',
  'email',
  'phonenumber',
  'name',
  'member',
];

export const ACCESS_MONITORING_MEMBER_FILTERING_IDENTIFIERS = [
  'member_first_name',
  'member_last_name',
  'member_email',
  'member_phonenumber',
];

/** Member filtering is possible once for each identifiers in section below
 *  but possible twice per report containing both identifiers
 */
export const SOURCE_MEMBER_FILTERING_IDENTIFIERS = [
  'src_firstname',
  'src_lastname',
  'src_email',
  'src_phonenumber',
];

export const DESTINATION_MEMBER_FILTERING_IDENTIFIERS = [
  'dst_firstname',
  'dst_lastname',
  'dst_email',
  'dst_phonenumber',
];

export const REFERRAL_GRANT_REFERRING_MEMBER_FILTERING_IDENTIFIERS = [
  ReferralGrantMetadataIdentifierEnum.REFERRING_MEMBER_EMAIL,
  ReferralGrantMetadataIdentifierEnum.REFERRING_MEMBER_LAST_NAME,
  ReferralGrantMetadataIdentifierEnum.REFERRING_MEMBER_FIRST_NAME,
];

export const REFERRAL_GRANT_REFERRED_MEMBER_FILTERING_IDENTIFIERS = [
  ReferralGrantMetadataIdentifierEnum.REFERRED_MEMBER_EMAIL,
  ReferralGrantMetadataIdentifierEnum.REFERRED_MEMBER_LAST_NAME,
  ReferralGrantMetadataIdentifierEnum.REFERRED_MEMBER_FIRST_NAME,
];

export const GROUPED_IDENTIFIERS_FILTER = [
  MEMBER_FILTERING_COLUMN_IDENTIFIERS,
  REFERRAL_GRANT_REFERRING_MEMBER_FILTERING_IDENTIFIERS,
  REFERRAL_GRANT_REFERRED_MEMBER_FILTERING_IDENTIFIERS,
  SOURCE_MEMBER_FILTERING_IDENTIFIERS,
  DESTINATION_MEMBER_FILTERING_IDENTIFIERS,
  ACCESS_MONITORING_MEMBER_FILTERING_IDENTIFIERS,
];

/**
 * -------------------------------
 */

export const REPORT_CATEGORIES_WITHOUT_ARCHIVED_MEMBERS = [
  ReportCategoryEnum.MEMBERS,
  ReportCategoryEnum.MEMBERS_PURCHASE,
  ReportCategoryEnum.FIRST_BOOKING,
];

export const REPORT_VIEWS_FETCHING_PAGINATION_SIZE = 20;

export const FILTERABLE_PRODUCT_TYPE_OPTIONS: {
  translationKey: string;
  value: BuyableItemOptions;
  datatypeFiltering: DynamicFilterDataType;
}[] = [
  {
    translationKey: 'product_type.payment_pack',
    value: BuyableItemOptions.BUYABLE_ITEM_PASS,
    datatypeFiltering: 'payment_pack',
  },
  {
    translationKey: 'product_type.shop_item',
    value: BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM,
    datatypeFiltering: 'shop_item',
  },
  {
    translationKey: 'product_type.private_pass',
    value: BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS,
    datatypeFiltering: 'private_pass',
  },
  {
    translationKey: 'product_type.giftcard',
    value: BuyableItemOptions.BUYABLE_ITEM_GIFTCARD,
    datatypeFiltering: 'giftcard',
  },
];

export const FILTERABLE_PRODUCT_CATEGORY_OPTIONS: {
  translationKey: string;
  value: BuyableItemOptions;
  datatypeFiltering: DynamicFilterDataType;
}[] = [
  {
    translationKey: 'product_type.payment_pack',
    value: BuyableItemOptions.BUYABLE_ITEM_PASS,
    datatypeFiltering: 'payment_pack_category',
  },
  {
    translationKey: 'product_type.shop_item',
    value: BuyableItemOptions.BUYABLE_ITEM_SHOP_ITEM,
    datatypeFiltering: 'subshop',
  },
  {
    translationKey: 'product_type.private_pass',
    value: BuyableItemOptions.BUYABLE_ITEM_PRIVATE_PASS,
    datatypeFiltering: 'private_pass_category',
  },
];

export const REPORT_CATEGORIES_WITH_DISABLED_PAYMENT_PACK = [
  ReportCategoryEnum.INVOICES,
];

export const FILTERABLE_BILLING_PLAN_PRODUCT_TYPE_OPTIONS: {
  translationKey: string;
  value: BillingPlanDynamicForeignKeyType;
  datatypeFiltering: DynamicFilterDataType;
}[] = [
  {
    translationKey: 'product_type.payment_pack',
    value: PAYMENT_PACK_DYNAMIC_FILTER,
    datatypeFiltering: 'payment_pack',
  },
  {
    translationKey: 'product_type.private_pass',
    value: PRIVATE_PASS_DYNAMIC_FILTER,
    datatypeFiltering: 'private_pass',
  },
  {
    translationKey: 'product_type.payment_combo',
    value: PAYMENT_COMBO_DYNAMIC_FILTER,
    datatypeFiltering: 'payment_combo',
  },
];
