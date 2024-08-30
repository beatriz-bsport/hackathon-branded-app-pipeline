import {
  GROUP_OR_OPERAND,
  GROUP_AND_OPERAND,
  FILTER_EQUAL_OPERAND,
  FILTER_NOT_EQUAL_OPERAND,
  FILTER_LTE_OPERAND,
  FILTER_GTE_OPERAND,
  FILTER_IN_OPERAND,
  FILTER_OUT_OPERAND,
} from './constants';

export type DatatypeFilteringState = {
  dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
};

export type DataSourceMedadataDataType =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'billing_group_address'
  | 'booking_status_code'
  | 'dispute_status'
  | 'boolean'
  | 'coach'
  | 'contract'
  | 'company'
  | 'coupon'
  | 'cts'
  | 'date'
  | 'datetime'
  | 'dow'
  | 'email'
  | 'establishment'
  | 'giftcard'
  | 'int'
  | 'invoice_status'
  | 'number'
  | 'payment_engine'
  | 'payment_method'
  | 'payment_method_with_credit_account'
  | 'payment_pack'
  | 'payment_pack_category'
  | 'payout'
  | 'payout_status'
  | 'percent'
  | 'billing_plan_status'
  | 'price'
  | 'private_pass'
  | 'private_pass_category'
  | 'private_service'
  | 'private_slot'
  | 'product_type'
  | 'source_device'
  | 'string'
  | 'subshop'
  | 'staff'
  | 'time'
  | 'user'
  | 'video'
  | 'bookkeeping_account'
  | 'access_monitoring_status'
  | 'access_monitoring_admission'
  | 'establishment_group';

export type DataSourceMetadata = {
  identifier: string;
  name: string;
  datatype: DataSourceMedadataDataType;
  is_filterable: boolean;
  summable: boolean;
  averageable: boolean;
};

export type DateFilterRangeEnum =
  | 'last_week'
  | 'last_month'
  | 'last_year'
  | 'week'
  | 'month'
  | 'trimester'
  | 'year'
  | 'week_to_date'
  | 'month_to_date'
  | 'year_to_date'
  | 'next_week'
  | 'next_month'
  | 'next_trimester'
  | 'next_year'
  | 'custom';

export type DateFilterEnum = 'today' | 'yesterday' | 'custom';

export type DatatypeFilterConfigGroupOperand =
  | typeof GROUP_OR_OPERAND
  | typeof GROUP_AND_OPERAND;

export type DatatypeFilterConfigItemTypeById =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'billing_group_address'
  | 'booking_status_code'
  | 'dispute_status'
  | 'coach'
  | 'company'
  | 'contract'
  | 'coupon'
  | 'dow'
  | 'email'
  | 'establishment'
  | 'giftcard'
  | 'invoice_status'
  | 'payment_engine'
  | 'payment_method'
  | 'payment_method_with_credit_account'
  | 'payment_pack'
  | 'payment_pack_category'
  | 'payout'
  | 'payout_status'
  | 'billing_plan_status'
  | 'private_pass'
  | 'private_pass_category'
  | 'private_service'
  | 'private_slot'
  | 'source_device'
  | 'subshop'
  | 'staff'
  | 'user'
  | 'video'
  | 'bookkeeping_account'
  | 'access_monitoring_status'
  | 'access_monitoring_admission'
  | 'establishment_group'
  | 'product_type';

export type DatatypeFilterConfigItemComparatorById =
  | typeof FILTER_IN_OPERAND
  | typeof FILTER_OUT_OPERAND;

export type DatatypeFilterConfigItemTypeFloat =
  | 'int'
  | 'price'
  | 'number'
  | 'percent';
export type DatatypeFilterConfigItemComparatorFloatSingle =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND
  | typeof FILTER_LTE_OPERAND
  | typeof FILTER_GTE_OPERAND;

export type DatatypeFilterConfigItemComparatorFloatMultiple =
  | typeof FILTER_IN_OPERAND
  | typeof FILTER_OUT_OPERAND;

export type DatatypeFilterConfigItemComparatorBoolean =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND;

export type DatatypeFilterConfigItemTypeDate = 'date' | 'time';
export type DatatypeFilterConfigItemTypeCompleteDate = 'datetime';
export type DatatypeFilterConfigItemComparatorDateSingle =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND
  | typeof FILTER_LTE_OPERAND
  | typeof FILTER_GTE_OPERAND;

export type DatatypeFilterConfigItemComparatorDateMultiple =
  typeof FILTER_IN_OPERAND;

export type DatatypeFilterConfigItem = {
  identifier: string;
  uuid: string;
} & (
  | {
      datatype: DatatypeFilterConfigItemTypeById;
      sub_datatype: null;
      time_period: null;
      comparator: DatatypeFilterConfigItemComparatorById;
      value: number[];
    }
  | {
      datatype: DatatypeFilterConfigItemTypeFloat;
      sub_datatype: null;
      time_period: null;
      comparator: DatatypeFilterConfigItemComparatorFloatSingle;
      value: number;
    }
  | {
      datatype: DatatypeFilterConfigItemTypeFloat;
      sub_datatype: null;
      time_period: null;
      comparator: DatatypeFilterConfigItemComparatorFloatMultiple;
      value: [number, number];
    }
  | {
      datatype: DatatypeFilterConfigItemTypeDate;
      sub_datatype: null;
      time_period: DateFilterEnum;
      comparator: DatatypeFilterConfigItemComparatorDateSingle;
      value: number;
    }
  | {
      datatype: DatatypeFilterConfigItemTypeDate;
      sub_datatype: null;
      time_period: DateFilterRangeEnum;
      comparator: DatatypeFilterConfigItemComparatorDateMultiple;
      value: [number, number];
    }
  | {
      datatype: DatatypeFilterConfigItemTypeCompleteDate;
      sub_datatype: 0 | 1;
      time_period: DateFilterEnum;
      comparator: DatatypeFilterConfigItemComparatorDateSingle;
      value: number;
    }
  | {
      datatype: DatatypeFilterConfigItemTypeCompleteDate;
      sub_datatype: 0 | 1;
      time_period: DateFilterRangeEnum;
      comparator: DatatypeFilterConfigItemComparatorDateMultiple;
      value: [number, number];
    }
  | {
      datatype: 'boolean';
      time_period: null;
      sub_datatype: null;
      comparator: DatatypeFilterConfigItemComparatorBoolean;
      value: boolean;
    }
);

export type AllComparator =
  | DatatypeFilterConfigItemComparatorFloatSingle
  | DatatypeFilterConfigItemComparatorFloatMultiple
  | DatatypeFilterConfigItemComparatorBoolean
  | DatatypeFilterConfigItemComparatorDateSingle
  | DatatypeFilterConfigItemComparatorDateMultiple;

export type DynamicFilterDataType =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'billing_group_address'
  | 'coach'
  | 'company'
  | 'contract'
  | 'coupon'
  | 'establishment'
  | 'giftcard'
  | 'payment_pack'
  | 'payment_pack_category'
  | 'private_pass'
  | 'private_pass_category'
  | 'private_service'
  | 'private_slot'
  | 'subshop'
  | 'staff'
  | 'video'
  | 'bookkeeping_account'
  | 'user'
  | 'establishment_group'
  | 'shop_item';

export type DataSourceFieldMetadata = {
  identifier: string;
  name: string;
  datatype: DataSourceMedadataDataType;
  is_filterable: boolean;
  summable: boolean;
  averageable: boolean;
};

export type DatatypeFilterConfig = {
  group_operand: DatatypeFilterConfigGroupOperand;
  groups: Array<DatatypeFilterConfigGroup>;
};

export type DatatypeFilterConfigGroup = {
  inner_operand: DatatypeFilterConfigGroupOperand;
  filters_data: DatatypeFilterConfigItem[];
  uuid: string;
  display_has_single: boolean;
};
