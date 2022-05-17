import {
  ReportFilterConfigItemComparatorBoolean,
  ReportFilterConfigItemComparatorById,
  ReportFilterConfigItemComparatorDateMultiple,
  ReportFilterConfigItemComparatorDateSingle,
  ReportFilterConfigItemComparatorFloatMultiple,
  ReportFilterConfigItemComparatorFloatSingle,
} from './types';

export const COLUMN_FILTERABLE_DATATYPE = [
  'activity',
  'billing_establishment',
  'billing_group',
  'booking_status_code',
  'boolean',
  'coach',
  'contract',
  'coupon',
  'date',
  'datetime',
  'dow',
  'email',
  'establishment',
  'giftcard',
  'int',
  'number',
  'payment_method',
  'payment_pack',
  'payout_status',
  'payout',
  'percent',
  'phone',
  'price',
  'private_pass',
  'private_service',
  'private_slot',
  'string',
  'subshop',
  'time',
  'user',
  'video',
];

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
  'booking_status_code',
  'coach',
  'contract',
  'coupon',
  'dow',
  'email',
  'establishment',
  'giftcard',
  'payment_method',
  'payment_pack',
  'payout',
  'payout_status',
  'phone',
  'private_pass',
  'private_service',
  'private_slot',
  'subshop',
  'user',
  'video',
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

export const FILTER_OPERAND_LIST: ReportFilterConfigItemComparatorById[] = [
  FILTER_IN_OPERAND,
  FILTER_OUT_OPERAND,
];

export const FILTER_OPERAND_FLOAT: (
  | ReportFilterConfigItemComparatorFloatSingle
  | ReportFilterConfigItemComparatorFloatMultiple
)[] = [
  FILTER_EQUAL_OPERAND,
  FILTER_NOT_EQUAL_OPERAND,
  FILTER_LTE_OPERAND,
  FILTER_GTE_OPERAND,
  FILTER_IN_OPERAND,
];

export const FILTER_OPERAND_BOOLEAN: ReportFilterConfigItemComparatorBoolean[] =
  [FILTER_EQUAL_OPERAND, FILTER_NOT_EQUAL_OPERAND];

export const FILTER_OPERAND_DATE: (
  | ReportFilterConfigItemComparatorDateSingle
  | ReportFilterConfigItemComparatorDateMultiple
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
  private_service: false,
  private_slot: false,
  email: false,
  contract: false,
  shop: false,
  subshop: false,
};

export const DATE_SUBDATA_TYPE = 0;
export const HOUR_SUBDATA_TYPE = 1;
