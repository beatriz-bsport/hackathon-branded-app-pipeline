import {
  DisputeMetadataIdentifierEnum,
  ExpenseMetadataIdentifierEnum,
  InvoiceMetadataIdentifierEnum,
  OnSpotPaymentMetadataIdentifierEnum,
  PaymentByInstalmentsMetadataIdentifierEnum,
  PaymentMetadataIdentifierEnum,
  UnpaidInvoiceMetadataIdentifierEnum,
} from '@bsport/common/lib/master-data/metadata-identifiers';
import { ReportCategoryEnum } from '@bsport/common/lib/master-data/report-categories';

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
