import {
  DatatypeFilterConfigItemComparatorBoolean,
  DatatypeFilterConfigItemComparatorById,
  DatatypeFilterConfigItemComparatorDateMultiple,
  DatatypeFilterConfigItemComparatorDateSingle,
  DatatypeFilterConfigItemComparatorFloatMultiple,
  DatatypeFilterConfigItemComparatorFloatSingle,
} from './types';

export const DATA_SOURCE_FILTERABLE_DATATYPE = [
  'activity',
  'billing_establishment',
  'billing_group',
  'billing_group_address',
  'booking_status_code',
  'dispute_status',
  'boolean',
  'coach',
  'contract',
  'consumer_giftcard_kind',
  'company',
  'coupon',
  'coupon_type_excluding_referrals',
  'date',
  'datetime',
  'distance',
  'dow',
  'email',
  'establishment',
  'giftcard',
  'int',
  'invoice_status',
  'number',
  'payment_engine',
  'payment_method',
  'payment_method_with_credit_account',
  'payment_pack',
  'payment_pack_category',
  'payout_status',
  'payout',
  'percent',
  'phone',
  'billing_plan_status',
  'price',
  'private_pass',
  'private_pass_category',
  'private_service',
  'private_slot',
  'string',
  'subshop',
  'supplier',
  'time',
  'user',
  'video',
  'source_device',
  'staff',
  'bookkeeping_account',
];

export enum ReportFilterableDataType {
  ACTIVITY = 'activity',
  BILLING_ESTABLISHMENT = 'billing_establishment',
  BILLING_GROUP = 'billing_group',
  BILLING_GROUP_ADDRESS = 'billing_group_address',
  BOOKING_STATUS_CODE = 'booking_status_code',
  DISPUTE_STATUS = 'dispute_status',
  BOOLEAN = 'boolean',
  COACH = 'coach',
  COMPANY = 'company',
  CONSUMER_GIFTCARD_KIND = 'consumer_giftcard_kind',
  CONTRACT = 'contract',
  COUPON = 'coupon',
  COUPON_TYPE_EXCLUDING_REFERRALS = 'coupon_type_excluding_referrals',
  CTS = 'cts',
  DATE = 'date',
  DATETIME = 'datetime',
  DISTANCE = 'distance',
  DOW = 'dow',
  EMAIL = 'email',
  ESTABLISHMENT = 'establishment',
  GIFTCARD = 'giftcard',
  INT = 'int',
  INVOICE_STATUS = 'invoice_status',
  NUMBER = 'number',
  PAYMENT_ENGINE = 'payment_engine',
  PAYMENT_METHOD = 'payment_method',
  PAYMENT_METHOD_WITH_CREDIT_ACCOUNT = 'payment_method_with_credit_account',
  PAYMENT_PACK = 'payment_pack',
  PAYMENT_PACK_CATEGORY = 'payment_pack_category',
  PAYOUT_STATUS = 'payout_status',
  PAYOUT = 'payout',
  PERCENT = 'percent',
  PHONE = 'phone',
  BILLING_PLAN_STATUS = 'billing_plan_status',
  PRICE = 'price',
  PRIVATE_PASS = 'private_pass',
  PRIVATE_PASS_CATEGORY = 'private_pass_category',
  PRIVATE_SERVICE = 'private_service',
  PRIVATE_SLOT = 'private_slot',
  STRING = 'string',
  SUBSHOP = 'subshop',
  SUPPLIER = 'supplier',
  TIME = 'time',
  USER = 'user',
  VIDEO = 'video',
  SOURCE_DEVICE = 'source_device',
  STAFF = 'staff',
  BOOKKEEPING_ACCOUNT = 'bookkeeping_account',
  ACCESS_MONITORING_STATUS = 'access_monitoring_status',
  ACCESS_MONITORING_ADMISSION = 'access_monitoring_admission',
  ESTABLISHMENT_GROUP = 'establishment_group',
  PRODUCT_TYPE = 'product_type',
  SHOP_ITEM = 'shop_item',
  PRODUCTS = 'products',
  PRODUCT_CATEGORY = 'product_category',
  PAYMENT_COMBO = 'payment_combo',
  BILLING_PLAN_PRODUCT = 'billing_plan_product',
}

export const DATATYPE_FILTERABLE_BY_FLOAT_RANGE = [
  'cts',
  'int',
  'number',
  'percent',
  'price',
];
export const DATATYPE_FILTERABLE_BY_ID_IN = [
  'activity',
  'billing_establishment',
  'billing_group',
  'billing_group_address',
  'booking_status_code',
  'dispute_status',
  'coach',
  'company',
  'consumer_giftcard_kind',
  'contract',
  'coupon',
  'coupon_type_excluding_referrals',
  'dow',
  'email',
  'invoice_status',
  'payment_engine',
  'establishment',
  'giftcard',
  'payment_method',
  'payment_method_with_credit_account',
  'payment_pack',
  'payment_pack_category',
  'payout',
  'payout_status',
  'phone',
  'billing_plan_status',
  'private_pass',
  'private_pass_category',
  'private_service',
  'private_slot',
  'source_device',
  'subshop',
  'supplier',
  'user',
  'video',
  'staff',
  'bookkeeping_account',
  'access_monitoring_status',
  'access_monitoring_admission',
  'establishment_group',
  'products',
  'product_type',
  'product_category',
  'billing_plan_product',
];

export const DATATYPE_PRESET_INTEGER_VALUE = [
  'invoice_status',
  'payment_method',
  'payment_method_with_credit_account',
  'consumer_giftcard_kind',
  'payout_status',
  'billing_plan_status',
  'booking_status_code',
  'dispute_status',
  'source_device',
  'payment_engine',
  'coupon_type_excluding_referrals',
  'access_monitoring_status',
  'access_monitoring_admission',
  'product_type',
  'products',
];

export const DATATYPE_FILTERABLE_BY_DATE = ['datetime', 'date', 'time'];

export const GROUP_OR_OPERAND = 0;
export const GROUP_AND_OPERAND = 1;

export const FILTER_EQUAL_OPERAND = 0;
export const FILTER_NOT_EQUAL_OPERAND = 1;
export const FILTER_LTE_OPERAND = 2;
export const FILTER_GTE_OPERAND = 3;
export const FILTER_IN_OPERAND = 4;
export const FILTER_OUT_OPERAND = 5;

export const GROUP_OPERAND_LIST = [GROUP_OR_OPERAND, GROUP_AND_OPERAND];

export const FILTER_OPERAND_LIST: DatatypeFilterConfigItemComparatorById[] = [
  FILTER_IN_OPERAND,
  FILTER_OUT_OPERAND,
];

export const FILTER_OPERAND_FLOAT: (
  | DatatypeFilterConfigItemComparatorFloatSingle
  | DatatypeFilterConfigItemComparatorFloatMultiple
)[] = [
  FILTER_EQUAL_OPERAND,
  FILTER_NOT_EQUAL_OPERAND,
  FILTER_LTE_OPERAND,
  FILTER_GTE_OPERAND,
  FILTER_IN_OPERAND,
];

export const FILTER_OPERAND_BOOLEAN: DatatypeFilterConfigItemComparatorBoolean[] =
  [FILTER_EQUAL_OPERAND, FILTER_NOT_EQUAL_OPERAND];

export const FILTER_OPERAND_DATE: (
  | DatatypeFilterConfigItemComparatorDateSingle
  | DatatypeFilterConfigItemComparatorDateMultiple
)[] = [FILTER_EQUAL_OPERAND, FILTER_IN_OPERAND, FILTER_NOT_EQUAL_OPERAND];

export const FILTER_OPERAND_LIST_ID = 0;
export const FILTER_OPERAND_FLOAT_ID = 1;
export const FILTER_OPERAND_BOOLEAN_ID = 2;
export const FILTER_OPERAND_DATE_ID = 3;

export const defaultDynamicDataHasBeenLoaded = {
  activity: false,
  payment_pack: false,
  coach: false,
  establishment: false,
  user: false,
  billing_group: false,
  company: false,
  private_pass: false,
  billing_establishment: false,
  coupon: false,
  giftcard: false,
  video: false,
  staff: false,
  private_service: false,
  private_slot: false,
  email: false,
  contract: false,
  shop: false,
  subshop: false,
  supplier: false,
  bookkeeping_account: false,
  establishment_group: false,
  billing_group_address: false,
  payment_pack_category: false,
  private_pass_category: false,
  shop_item: false,
  payment_combo: false,
};

export const DATE_SUBDATA_TYPE = 0;
export const HOUR_SUBDATA_TYPE = 1;

export const MAX_SELECTABLE_MEMBER = 10;

export const PAYMENT_PACK_DYNAMIC_FILTER = 1;
export const PRIVATE_PASS_DYNAMIC_FILTER = 2;
export const PAYMENT_COMBO_DYNAMIC_FILTER = 3;
