import { ErrorAndLoading } from '#libs/types';
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

export type ReportingState = {
  reportResponse: {
    reportId: {
      result: (string | number | null)[];
      previous_page: null | number;
      next_page: number;
      other_pages: number[];
    };
  };
  allIds: null | number[];
  loading: boolean;
  error: null | string;
  page_size: number;
  reportId: null | number;
  reportHeaders: ReportHeader;
  headersLoading: boolean;
  headersError: null | string;
  excelReportingReducer: {
    loading: boolean;
    link: null | string;
    error: null | string;
  };
  list: {
    loading: boolean;
    error: null | string;
    results: ReportConfiguration[];
  };
  metadata: {
    loading: boolean;
    error: null | string;
    results: ReportMetadataValue[];
  };
  offerManagement: ErrorAndLoading;
  reportFilterConfigs: {
    dynamicDataHasBeenLoaded: Record<DynamicFilterDataType, boolean>;
    byId: Record<number, ReportFilterConfig>;
    allIds: number[];
  } & ErrorAndLoading;
};

export type ReportConfiguration = {
  id: number;
  name: string;
  category: ReportCategoryEnum;
  description: string;
  columns: string[];
  date_start: Date;
  date_end: Date;
  report_filter_config_id: number | null;
  time_period: DateFilterRangeEnum | DateFilterEnum | null;
};

export type ReportCategoryEnum = 'members' | 'payments' | 'products';

export type ReportCategory = {
  id: string;
  name?: ReportCategoryEnum;
  icon: any;
};

export type ReportHeader = {
  averageable?: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
  summable?: {
    column_identifier: string;
    datatype: string;
    column_value: null | number;
  }[];
};

export type ReportMedadataDataType =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'booking_status_code'
  | 'boolean'
  | 'coach'
  | 'contract'
  | 'coupon'
  | 'cts'
  | 'date'
  | 'datetime'
  | 'dow'
  | 'email'
  | 'establishment'
  | 'giftcard'
  | 'int'
  | 'number'
  | 'payment_method'
  | 'payment_pack'
  | 'payout'
  | 'payout_status'
  | 'percent'
  | 'price'
  | 'private_pass'
  | 'private_service'
  | 'private_slot'
  | 'string'
  | 'subshop'
  | 'staff'
  | 'time'
  | 'user'
  | 'video';

export type ReportMetadataColumn = {
  identifier: string;
  name: string;
  datatype: ReportMedadataDataType;
  is_filterable: boolean;
};

export type ReportMetadataValue = {
  global_category: ReportCategoryEnum;
  category: ReportCategoryEnum;
  columns: ReportMetadataColumn[];
};

export type ReportMetadata = {
  results: ReportMetadataValue[];
  loading: boolean;
  error?: boolean;
};

export type DateFilterRangeEnum =
  | 'week'
  | 'month'
  | 'trimester'
  | 'year'
  | 'custom';

export type DateFilterEnum = 'today';

export type ReportFilterConfig = {
  id: number;
  report: number;
  name: string;
  config: {
    group_operand: ReportFilterConfigItemComparatorById;
    groups: ReportFilterConfigGroup[];
  };
};

export type ReportFilterConfigGroup = {
  inner_operand: ReportFilterConfigGroupOperand;
  filters_data: ReportFilterConfigItem[];
  uuid: string;
  display_has_single: boolean;
};

export type ReportFilterConfigGroupOperand =
  | typeof GROUP_OR_OPERAND
  | typeof GROUP_AND_OPERAND;

export type ReportFilterConfigItemTypeById =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'booking_status_code'
  | 'coach'
  | 'company'
  | 'contract'
  | 'coupon'
  | 'dow'
  | 'email'
  | 'establishment'
  | 'giftcard'
  | 'payment_method'
  | 'payment_pack'
  | 'payout'
  | 'payout_status'
  | 'private_pass'
  | 'private_service'
  | 'private_slot'
  | 'subshop'
  | 'staff'
  | 'user'
  | 'video';

export type ReportFilterConfigItemComparatorById =
  | typeof FILTER_IN_OPERAND
  | typeof FILTER_OUT_OPERAND;

export type ReportFilterConfigItemTypeFloat =
  | 'int'
  | 'price'
  | 'number'
  | 'percent';
export type ReportFilterConfigItemComparatorFloatSingle =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND
  | typeof FILTER_LTE_OPERAND
  | typeof FILTER_GTE_OPERAND;

export type ReportFilterConfigItemComparatorFloatMultiple =
  | typeof FILTER_IN_OPERAND
  | typeof FILTER_OUT_OPERAND;

export type ReportFilterConfigItemComparatorBoolean =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND;

export type ReportFilterConfigItemTypeDate = 'date' | 'time';
export type ReportFilterConfigItemTypeCompleteDate = 'datetime';
export type ReportFilterConfigItemComparatorDateSingle =
  | typeof FILTER_EQUAL_OPERAND
  | typeof FILTER_NOT_EQUAL_OPERAND
  | typeof FILTER_LTE_OPERAND
  | typeof FILTER_GTE_OPERAND;

export type ReportFilterConfigItemComparatorDateMultiple =
  typeof FILTER_IN_OPERAND;

export type ReportFilterConfigItem = {
  identifier: string;
  uuid: number;
} & (
  | {
      datatype: ReportFilterConfigItemTypeById;
      sub_datatype: null;
      time_period: null;
      comparator: ReportFilterConfigItemComparatorById;
      value: number[];
    }
  | {
      datatype: ReportFilterConfigItemTypeFloat;
      sub_datatype: null;
      time_period: null;
      comparator: ReportFilterConfigItemComparatorFloatSingle;
      value: number;
    }
  | {
      datatype: ReportFilterConfigItemTypeFloat;
      sub_datatype: null;
      time_period: null;
      comparator: ReportFilterConfigItemComparatorFloatMultiple;
      value: [number, number];
    }
  | {
      datatype: ReportFilterConfigItemTypeDate;
      sub_datatype: null;
      time_period: DateFilterEnum;
      comparator: ReportFilterConfigItemComparatorDateSingle;
      value: number;
    }
  | {
      datatype: ReportFilterConfigItemTypeDate;
      sub_datatype: null;
      time_period: DateFilterRangeEnum;
      comparator: ReportFilterConfigItemComparatorDateMultiple;
      value: [number, number];
    }
  | {
      datatype: ReportFilterConfigItemTypeCompleteDate;
      sub_datatype: 0 | 1;
      time_period: DateFilterEnum;
      comparator: ReportFilterConfigItemComparatorDateSingle;
      value: number;
    }
  | {
      datatype: ReportFilterConfigItemTypeCompleteDate;
      sub_datatype: 0 | 1;
      time_period: DateFilterRangeEnum;
      comparator: ReportFilterConfigItemComparatorDateMultiple;
      value: [number, number];
    }
  | {
      datatype: 'boolean';
      time_period: null;
      sub_datatype: null;
      comparator: ReportFilterConfigItemComparatorBoolean;
      value: boolean;
    }
);

export type AllComparator =
  | ReportFilterConfigItemComparatorFloatSingle
  | ReportFilterConfigItemComparatorFloatMultiple
  | ReportFilterConfigItemComparatorBoolean
  | ReportFilterConfigItemComparatorDateSingle
  | ReportFilterConfigItemComparatorDateMultiple;

export type DynamicFilterDataType =
  | 'activity'
  | 'billing_establishment'
  | 'billing_group'
  | 'coach'
  | 'company'
  | 'contract'
  | 'coupon'
  | 'establishment'
  | 'giftcard'
  | 'payment_pack'
  | 'private_pass'
  | 'private_service'
  | 'private_slot'
  | 'subshop'
  | 'staff'
  | 'video';

export type ReportFilterConfigParams = {
  id__in?: number[];
  report_id_in?: number[];
  page?: number;
  page_size?: number | null;
};
